import { Hono } from 'hono';

// In-memory store for telegram history (last 50 messages)
interface TelegramMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  hasImage?: boolean;
}

let telegramHistory: TelegramMessage[] = [];
const MAX_HISTORY = 50;

export const telegramRoutes = new Hono();

// Get conversation history
telegramRoutes.get('/history', (c) => {
  return c.json({
    messages: telegramHistory,
    count: telegramHistory.length,
  });
});

// Push new messages (called by bot)
telegramRoutes.post('/history', async (c) => {
  try {
    const body = await c.req.json();

    // Accept single message or array
    const messages: TelegramMessage[] = Array.isArray(body.messages)
      ? body.messages
      : body.message
        ? [body.message]
        : [];

    if (messages.length === 0) {
      return c.json({ error: 'No messages provided' }, 400);
    }

    // Add to history
    for (const msg of messages) {
      telegramHistory.push({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp || new Date().toISOString(),
        hasImage: msg.hasImage || false,
      });
    }

    // Trim to max
    if (telegramHistory.length > MAX_HISTORY) {
      telegramHistory = telegramHistory.slice(-MAX_HISTORY);
    }

    return c.json({
      success: true,
      count: telegramHistory.length
    });
  } catch (e) {
    return c.json({ error: 'Invalid request body' }, 400);
  }
});

// Replace entire history (for sync)
telegramRoutes.put('/history', async (c) => {
  try {
    const body = await c.req.json();

    if (!Array.isArray(body.messages)) {
      return c.json({ error: 'messages array required' }, 400);
    }

    telegramHistory = body.messages.slice(-MAX_HISTORY).map((msg: any) => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp || new Date().toISOString(),
      hasImage: msg.hasImage || !!msg.image,
    }));

    return c.json({
      success: true,
      count: telegramHistory.length
    });
  } catch (e) {
    return c.json({ error: 'Invalid request body' }, 400);
  }
});

// Clear history
telegramRoutes.delete('/history', (c) => {
  telegramHistory = [];
  return c.json({ success: true });
});
