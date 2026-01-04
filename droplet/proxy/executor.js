/**
 * Claude Executor for Proxy
 *
 * Executes Claude Code with Chrome DevTools MCP for web scraping,
 * falls back to WebFetch if Chrome fails.
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { buildPrompt } = require('./tasks');

// Configuration
const CLAUDE_PATH = process.env.CLAUDE_PATH || 'claude';
const DEFAULT_TIMEOUT = 60000; // 60 seconds
const SYNC_THRESHOLD = 30000;  // Switch to async after 30s

/**
 * Execute a task with Claude
 *
 * @param {Object} options
 * @param {string} options.url - URL to process
 * @param {string} options.task - Task template name
 * @param {string} options.prompt - Custom prompt (for 'custom' task)
 * @param {Object} options.output_schema - Optional JSON schema for output
 * @param {number} options.timeout - Timeout in ms
 * @param {Function} options.onProgress - Progress callback
 * @returns {Promise<Object>} Result with data and metadata
 */
async function execute(options) {
  const {
    url,
    task = 'extract_product',
    prompt: customPrompt,
    output_schema,
    timeout = DEFAULT_TIMEOUT,
    onProgress
  } = options;

  const startTime = Date.now();

  // Build the prompt
  const fullPrompt = buildPrompt(task, url, {
    prompt: customPrompt,
    output_schema
  });

  // Add MCP instructions
  const promptWithMcp = `
You have access to Chrome DevTools MCP for web scraping. Use it to:
1. Navigate to the URL
2. Take a snapshot to see the page content
3. Extract the required data

If Chrome DevTools fails or times out, fall back to using WebFetch.

IMPORTANT: Return ONLY valid JSON. No markdown, no explanation, just the JSON object.

${fullPrompt}
`;

  try {
    // Try with Chrome DevTools MCP first
    onProgress?.({ step: 'Starting Chrome DevTools...', tool: 'chrome-devtools' });

    const result = await runClaude(promptWithMcp, {
      timeout,
      onProgress
    });

    const duration = Date.now() - startTime;

    return {
      status: 'completed',
      data: parseJsonResponse(result.output),
      metadata: {
        duration_ms: duration,
        tool_used: result.tool_used || 'chrome-devtools',
        url_requested: url,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    // If Chrome fails, try WebFetch fallback
    if (error.message.includes('timeout') || error.message.includes('Chrome')) {
      onProgress?.({ step: 'Chrome failed, trying WebFetch...', tool: 'webfetch' });

      try {
        const fallbackPrompt = promptWithMcp.replace(
          'Chrome DevTools MCP',
          'WebFetch tool (Chrome unavailable)'
        );

        const result = await runClaude(fallbackPrompt, {
          timeout: timeout - (Date.now() - startTime),
          onProgress
        });

        const duration = Date.now() - startTime;

        return {
          status: 'completed',
          data: parseJsonResponse(result.output),
          metadata: {
            duration_ms: duration,
            tool_used: 'webfetch',
            fallback: true,
            url_requested: url,
            timestamp: new Date().toISOString()
          }
        };
      } catch (fallbackError) {
        throw new Error(`Both Chrome and WebFetch failed: ${fallbackError.message}`);
      }
    }

    throw error;
  }
}

/**
 * Run Claude CLI and capture output
 */
function runClaude(prompt, options = {}) {
  return new Promise((resolve, reject) => {
    const { timeout = DEFAULT_TIMEOUT, onProgress } = options;

    let output = '';
    let errorOutput = '';
    let tool_used = 'unknown';
    let timedOut = false;

    // Spawn Claude with --print flag for non-interactive mode
    const proc = spawn(CLAUDE_PATH, [
      '--dangerously-skip-permissions',
      '--print',
      '-p', prompt
    ], {
      cwd: process.env.HOME || '/root',
      env: {
        ...process.env,
        IS_SANDBOX: '1'
      },
      timeout
    });

    // Set up timeout
    const timer = setTimeout(() => {
      timedOut = true;
      proc.kill('SIGTERM');
      reject(new Error(`Claude execution timed out after ${timeout}ms`));
    }, timeout);

    proc.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;

      // Detect which tool is being used
      if (text.includes('chrome-devtools') || text.includes('take_snapshot')) {
        tool_used = 'chrome-devtools';
      } else if (text.includes('WebFetch')) {
        tool_used = 'webfetch';
      }

      // Report progress
      if (onProgress) {
        const lines = text.split('\n').filter(l => l.trim());
        for (const line of lines) {
          if (line.includes('Running') || line.includes('Fetching') || line.includes('Analyzing')) {
            onProgress({ step: line.trim(), tool: tool_used });
          }
        }
      }
    });

    proc.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    proc.on('close', (code) => {
      clearTimeout(timer);

      if (timedOut) return;

      if (code !== 0 && !output) {
        reject(new Error(`Claude exited with code ${code}: ${errorOutput}`));
      } else {
        resolve({ output, tool_used, exitCode: code });
      }
    });

    proc.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
  });
}

/**
 * Parse JSON from Claude's response
 * Handles markdown code blocks and extra text
 */
function parseJsonResponse(text) {
  // Try to extract JSON from markdown code block
  const jsonBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonBlockMatch) {
    try {
      return JSON.parse(jsonBlockMatch[1].trim());
    } catch (e) {
      // Continue to try other methods
    }
  }

  // Try to find raw JSON object
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      // Continue to try other methods
    }
  }

  // Try to find JSON array
  const arrayMatch = text.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try {
      return JSON.parse(arrayMatch[0]);
    } catch (e) {
      // Continue to try other methods
    }
  }

  // Try parsing the whole thing
  try {
    return JSON.parse(text.trim());
  } catch (e) {
    // Return as-is if we can't parse it
    return { raw_output: text, parse_error: 'Could not parse as JSON' };
  }
}

/**
 * Check if we should switch to async mode
 */
function shouldUseAsync(timeout) {
  return timeout > SYNC_THRESHOLD;
}

module.exports = {
  execute,
  runClaude,
  parseJsonResponse,
  shouldUseAsync,
  SYNC_THRESHOLD,
  DEFAULT_TIMEOUT
};
