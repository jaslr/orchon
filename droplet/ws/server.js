const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const orchestrator = require('../orchestrator');

const PORT = process.env.WS_PORT || 8405;
const POCKETBASE_URL = process.env.POCKETBASE_URL || 'https://orchon-pocketbase.fly.dev';

// Store active connections and threads (in-memory for active sessions)
const connections = new Map();
const threads = new Map();

// PocketBase API helper
async function pb(method, path, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  try {
    const response = await fetch(`${POCKETBASE_URL}/api/collections${path}`, options);
    if (!response.ok) {
      const error = await response.text();
      console.error(`PocketBase error: ${method} ${path} - ${response.status}: ${error}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`PocketBase request failed: ${method} ${path}`, error.message);
    return null;
  }
}

// Create WebSocket server
const wss = new WebSocket.Server({ port: PORT });

console.log(`WebSocket server listening on port ${PORT}`);
console.log(`PocketBase URL: ${POCKETBASE_URL}`);

wss.on('connection', (ws) => {
  const connectionId = uuidv4();
  connections.set(connectionId, { ws, authenticated: false, userId: null, deviceId: null });

  console.log(`New connection: ${connectionId}`);

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());
      await handleMessage(connectionId, message);
    } catch (error) {
      console.error('Error handling message:', error);
      sendError(ws, null, error.message);
    }
  });

  ws.on('close', () => {
    console.log(`Connection closed: ${connectionId}`);
    connections.delete(connectionId);
  });

  ws.on('error', (error) => {
    console.error(`Connection error ${connectionId}:`, error);
  });
});

async function handleMessage(connectionId, message) {
  const conn = connections.get(connectionId);
  if (!conn) return;

  const { ws } = conn;
  const { type } = message;

  // Handle auth first
  if (type === 'auth') {
    await handleAuth(connectionId, message);
    return;
  }

  // Require auth for all other messages
  if (!conn.authenticated) {
    sendError(ws, null, 'Not authenticated');
    return;
  }

  switch (type) {
    case 'thread.create':
      await handleThreadCreate(connectionId, message);
      break;
    case 'thread.list':
      await handleThreadList(connectionId, message);
      break;
    case 'thread.load':
      await handleThreadLoad(connectionId, message);
      break;
    case 'thread.message':
      await handleThreadMessage(connectionId, message);
      break;
    case 'thread.close':
      await handleThreadClose(connectionId, message);
      break;
    case 'action.confirm':
      handleActionConfirm(connectionId, message);
      break;
    case 'action.cancel':
      handleActionCancel(connectionId, message);
      break;
    default:
      sendError(ws, null, `Unknown message type: ${type}`);
  }
}

async function handleAuth(connectionId, message) {
  const conn = connections.get(connectionId);
  if (!conn) return;

  const { token, deviceId } = message;

  // TODO: Verify Google JWT token
  // For now, accept any token for development
  if (token) {
    conn.authenticated = true;
    conn.userId = 'dev-user';
    conn.deviceId = deviceId || 'unknown';
    send(conn.ws, { type: 'auth.success', userId: conn.userId });
    console.log(`Authenticated: ${connectionId} (device: ${conn.deviceId})`);
  } else {
    sendError(conn.ws, null, 'Invalid auth token');
  }
}

async function handleThreadCreate(connectionId, message) {
  const conn = connections.get(connectionId);
  if (!conn) return;

  const threadId = uuidv4();

  // Save to PocketBase
  const pbThread = await pb('POST', '/threads/records', {
    id: threadId,
    project_hint: message.projectHint || null,
    status: 'active',
    device_id: conn.deviceId,
  });

  if (!pbThread) {
    console.warn(`Failed to save thread ${threadId} to PocketBase, continuing in-memory only`);
  }

  const thread = {
    id: threadId,
    pbId: pbThread?.id || null,
    projectHint: message.projectHint || null,
    llmOverride: null,
    createdAt: pbThread?.created || new Date().toISOString(),
    updatedAt: pbThread?.updated || new Date().toISOString(),
    connectionId,
    messages: [],
    pendingActions: new Map(),
  };

  threads.set(threadId, thread);

  send(conn.ws, {
    type: 'thread.created',
    id: threadId,
    projectHint: thread.projectHint,
    createdAt: thread.createdAt,
    updatedAt: thread.updatedAt,
  });

  console.log(`Thread created: ${threadId} (project: ${thread.projectHint || 'general'}, pb: ${pbThread?.id || 'none'})`);
}

// List threads from PocketBase
async function handleThreadList(connectionId, message) {
  const conn = connections.get(connectionId);
  if (!conn) return;

  const { status = 'active', limit = 50 } = message;

  const result = await pb('GET', `/threads/records?filter=(status='${status}')&sort=-created&perPage=${limit}`);

  send(conn.ws, {
    type: 'thread.list',
    threads: result?.items?.map(t => ({
      id: t.id,
      projectHint: t.project_hint,
      status: t.status,
      title: t.title,
      createdAt: t.created,
      updatedAt: t.updated,
    })) || [],
  });
}

// Load a specific thread with its messages
async function handleThreadLoad(connectionId, message) {
  const conn = connections.get(connectionId);
  if (!conn) return;

  const { threadId } = message;

  // Check if already loaded in memory
  if (threads.has(threadId)) {
    const thread = threads.get(threadId);
    send(conn.ws, {
      type: 'thread.loaded',
      id: threadId,
      projectHint: thread.projectHint,
      messages: thread.messages,
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
    });
    return;
  }

  // Load from PocketBase
  const pbThread = await pb('GET', `/threads/records/${threadId}`);
  if (!pbThread) {
    sendError(conn.ws, threadId, 'Thread not found');
    return;
  }

  // Load messages
  const messagesResult = await pb('GET', `/messages/records?filter=(thread='${threadId}')&sort=created`);
  const messages = messagesResult?.items?.map(m => ({
    role: m.role,
    content: m.content,
    timestamp: m.created,
  })) || [];

  // Create in-memory thread for this session
  const thread = {
    id: threadId,
    pbId: pbThread.id,
    projectHint: pbThread.project_hint,
    llmOverride: pbThread.llm_override,
    createdAt: pbThread.created,
    updatedAt: pbThread.updated,
    connectionId,
    messages,
    pendingActions: new Map(),
  };

  threads.set(threadId, thread);

  send(conn.ws, {
    type: 'thread.loaded',
    id: threadId,
    projectHint: thread.projectHint,
    messages: thread.messages,
    createdAt: thread.createdAt,
    updatedAt: thread.updatedAt,
  });

  console.log(`Thread loaded from PocketBase: ${threadId} (${messages.length} messages)`);
}

async function handleThreadMessage(connectionId, message) {
  const conn = connections.get(connectionId);
  if (!conn) return;

  const { threadId, content, llm } = message;
  const thread = threads.get(threadId);

  if (!thread) {
    sendError(conn.ws, threadId, 'Thread not found');
    return;
  }

  // Update thread LLM if specified
  if (llm) {
    thread.llmOverride = llm;
  }

  // Store user message
  const userMessage = {
    role: 'user',
    content,
    timestamp: new Date().toISOString(),
  };
  thread.messages.push(userMessage);

  // Save user message to PocketBase
  await pb('POST', '/messages/records', {
    thread: threadId,
    role: 'user',
    content,
    status: 'complete',
  });

  const actionId = uuidv4();

  // Send stream start
  send(conn.ws, {
    type: 'stream.start',
    threadId,
    actionId,
  });

  let assistantContent = '';

  try {
    // Execute with orchestrator
    await orchestrator.executeWithStream(content, {
      threadId,
      projectHint: thread.projectHint,
      llm: thread.llmOverride,
      onChunk: (text) => {
        assistantContent += text;
        send(conn.ws, {
          type: 'stream.chunk',
          threadId,
          text,
        });
      },
      onStep: (step) => {
        send(conn.ws, {
          type: 'stream.step',
          threadId,
          step,
        });
      },
      onConfirm: (prompt) => {
        return new Promise((resolve) => {
          thread.pendingActions.set(actionId, { resolve, prompt });
          send(conn.ws, {
            type: 'action.confirm',
            threadId,
            actionId,
            prompt,
          });
        });
      },
      onComplete: async (result) => {
        const assistantMessage = {
          role: 'assistant',
          content: result || assistantContent,
          timestamp: new Date().toISOString(),
        };
        thread.messages.push(assistantMessage);
        thread.updatedAt = new Date().toISOString();

        // Save assistant message to PocketBase
        await pb('POST', '/messages/records', {
          thread: threadId,
          role: 'assistant',
          content: result || assistantContent,
          status: 'complete',
        });

        // Update thread timestamp
        await pb('PATCH', `/threads/records/${threadId}`, {
          title: thread.title || content.substring(0, 100),
        });

        send(conn.ws, {
          type: 'stream.end',
          threadId,
        });

        send(conn.ws, {
          type: 'action.complete',
          threadId,
          actionId,
          result,
        });
      },
    });
  } catch (error) {
    console.error(`Error in thread ${threadId}:`, error);

    // Save error message
    await pb('POST', '/messages/records', {
      thread: threadId,
      role: 'system',
      content: `Error: ${error.message}`,
      status: 'error',
    });

    send(conn.ws, {
      type: 'action.error',
      threadId,
      actionId,
      error: error.message,
    });
    send(conn.ws, {
      type: 'stream.end',
      threadId,
    });
  }
}

async function handleThreadClose(connectionId, message) {
  const conn = connections.get(connectionId);
  if (!conn) return;

  const { threadId, archive = false } = message;

  if (threads.has(threadId)) {
    const thread = threads.get(threadId);

    // Update status in PocketBase
    if (archive) {
      await pb('PATCH', `/threads/records/${threadId}`, {
        status: 'archived',
      });
    }

    threads.delete(threadId);
    send(conn.ws, {
      type: 'thread.deleted',
      threadId,
    });
    console.log(`Thread closed: ${threadId} (archived: ${archive})`);
  }
}

function handleActionConfirm(connectionId, message) {
  const { actionId, confirmed } = message;

  // Find thread with this pending action
  for (const [threadId, thread] of threads) {
    const pending = thread.pendingActions.get(actionId);
    if (pending) {
      pending.resolve(confirmed);
      thread.pendingActions.delete(actionId);
      return;
    }
  }
}

function handleActionCancel(connectionId, message) {
  const { actionId } = message;

  // Find thread with this pending action
  for (const [threadId, thread] of threads) {
    const pending = thread.pendingActions.get(actionId);
    if (pending) {
      pending.resolve(false);
      thread.pendingActions.delete(actionId);
      return;
    }
  }
}

function send(ws, message) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

function sendError(ws, threadId, error) {
  send(ws, {
    type: 'error',
    threadId,
    error,
  });
}

// Broadcast to all authenticated connections
function broadcast(message, excludeConnectionId = null) {
  for (const [connId, conn] of connections) {
    if (conn.authenticated && connId !== excludeConnectionId) {
      send(conn.ws, message);
    }
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down WebSocket server...');
  wss.close(() => {
    console.log('WebSocket server closed');
    process.exit(0);
  });
});

module.exports = { wss, broadcast };
