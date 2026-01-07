// External API health checkers (Claude, Gemini, Telegram, GitHub)

import { CHECK_TIMEOUT, DEGRADED_THRESHOLD } from '../config.js';
import type { CheckResult, EcosystemNode } from '../types.js';

// Generic HTTP check helper
async function checkEndpoint(
  url: string,
  options?: {
    method?: string;
    headers?: Record<string, string>;
    expectStatus?: number[];
  }
): Promise<CheckResult> {
  const start = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CHECK_TIMEOUT);

    const response = await fetch(url, {
      method: options?.method || 'GET',
      signal: controller.signal,
      headers: options?.headers,
    });

    clearTimeout(timeoutId);
    const responseTime = Date.now() - start;

    const expectedStatuses = options?.expectStatus || [200];
    if (!expectedStatuses.includes(response.status)) {
      return {
        status: 'down',
        responseTime,
        error: `HTTP ${response.status}`,
      };
    }

    return {
      status: responseTime > DEGRADED_THRESHOLD ? 'degraded' : 'healthy',
      responseTime,
      meta: { responseTime: `${responseTime}ms` },
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { status: 'unknown', error: 'Timeout' };
    }
    return {
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Check Claude API availability via status page or API endpoint
async function checkClaudeApi(): Promise<CheckResult> {
  // Check Anthropic status page - just verify it loads
  // We can't make actual API calls without credentials, but we can check if the API is responding
  try {
    const result = await checkEndpoint('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      expectStatus: [400, 401, 403], // Expect auth error, not 5xx
    });

    // If we get 4xx, the API is up but we're not authenticated (expected)
    if (result.status === 'down' && result.error?.startsWith('HTTP 4')) {
      return {
        ...result,
        status: 'healthy',
        meta: { ...result.meta, note: 'API responding (auth required)' },
      };
    }

    return result;
  } catch {
    return { status: 'unknown', error: 'Check failed' };
  }
}

// Check Gemini API availability
async function checkGeminiApi(): Promise<CheckResult> {
  // Check if Gemini API endpoint responds
  try {
    const result = await checkEndpoint(
      'https://generativelanguage.googleapis.com/v1/models',
      {
        expectStatus: [400, 401, 403], // Expect auth error without API key
      }
    );

    // If we get 4xx, the API is up
    if (result.status === 'down' && result.error?.startsWith('HTTP 4')) {
      return {
        ...result,
        status: 'healthy',
        meta: { ...result.meta, note: 'API responding (auth required)' },
      };
    }

    return result;
  } catch {
    return { status: 'unknown', error: 'Check failed' };
  }
}

// Check Telegram Bot API
async function checkTelegramApi(): Promise<CheckResult> {
  // We can check the Telegram API root without a token
  const result = await checkEndpoint('https://api.telegram.org/', {
    expectStatus: [200, 404], // Root might 404 but server responds
  });

  return result;
}

// Check GitHub API availability
async function checkGithubApi(): Promise<CheckResult> {
  // GitHub API status endpoint
  const result = await checkEndpoint('https://api.github.com/zen', {
    headers: { Accept: 'application/vnd.github.v3+json' },
  });

  return result;
}

// Get all external service nodes
export async function checkExternalServices(): Promise<EcosystemNode[]> {
  const nodes: EcosystemNode[] = [];

  // Claude API
  const claudeResult = await checkClaudeApi();
  nodes.push({
    id: 'claude-api',
    label: 'Claude API',
    type: 'external',
    status: claudeResult.status,
    url: 'https://console.anthropic.com',
    meta: claudeResult.meta,
  });

  // Gemini API
  const geminiResult = await checkGeminiApi();
  nodes.push({
    id: 'gemini-api',
    label: 'Gemini API',
    type: 'external',
    status: geminiResult.status,
    url: 'https://aistudio.google.com',
    meta: geminiResult.meta,
  });

  // Telegram API
  const telegramResult = await checkTelegramApi();
  nodes.push({
    id: 'telegram',
    label: 'Telegram API',
    type: 'external',
    status: telegramResult.status,
    url: 'https://telegram.org',
    meta: telegramResult.meta,
  });

  // GitHub API
  const githubResult = await checkGithubApi();
  nodes.push({
    id: 'github',
    label: 'GitHub API',
    type: 'external',
    status: githubResult.status,
    url: 'https://github.com',
    meta: githubResult.meta,
  });

  return nodes;
}
