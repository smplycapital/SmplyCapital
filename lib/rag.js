import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateEmbedding } from './embeddings.js';
import { search } from './vectorStore.js';
import agentConfig from '../data/agent-config.json';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const CHAT_MODEL = 'gemini-2.0-flash';

export async function chat(userMessage, conversationHistory = []) {
  // 1. Generate embedding for the user's query
  const queryEmbedding = await generateEmbedding(userMessage);

  // 2. Retrieve relevant documents
  const relevantDocs = search(queryEmbedding, 5);

  // 3. Build context from retrieved documents
  const context = relevantDocs
    .map((doc) => `[${doc.title}]\n${doc.content}`)
    .join('\n\n---\n\n');

  // 4. Build the system prompt with context
  const systemPrompt = `${agentConfig.system_prompt}

## Retrieved Knowledge Base Context
Use the following information to answer the user's question. Only use information from this context — do not make up facts about Simply Capital.

${context}

## Conversation Guidelines
- If the user's question is covered by the context above, answer using that information
- If the question is partially covered, answer what you can and suggest contacting the team for more details
- If the question is not covered at all, use the fallback: "${agentConfig.agent.fallback}"
- Keep responses concise but complete — 2-4 sentences for simple questions, more for complex ones
- When mentioning loan programs, include key specifics (ranges, LTV, terms)
- End responses with a natural next step when appropriate (submit scenario, call, ask another question)`;

  // 5. Build message history for Gemini
  const model = genAI.getGenerativeModel({
    model: CHAT_MODEL,
    systemInstruction: systemPrompt,
  });

  const chatSession = model.startChat({
    history: conversationHistory.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    })),
  });

  // 6. Generate response
  const result = await chatSession.sendMessage(userMessage);
  const response = result.response.text();

  return {
    reply: response,
    sources: relevantDocs.map((doc) => ({
      id: doc.id,
      title: doc.title,
      category: doc.category,
      score: doc.score,
    })),
  };
}
