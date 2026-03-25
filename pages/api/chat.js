import { chat } from '../../lib/rag';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (message.length > 1000) {
    return res.status(400).json({ error: 'Message too long (max 1000 characters)' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'AI service not configured' });
  }

  try {
    const conversationHistory = Array.isArray(history) ? history.slice(-10) : [];

    const result = await chat(message.trim(), conversationHistory);

    return res.status(200).json({
      reply: result.reply,
      sources: result.sources,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      error: 'Something went wrong. Please try again or contact us at (800) 555-1234.',
    });
  }
}
