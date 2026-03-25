import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const EMBEDDING_MODEL = 'text-embedding-004';

export async function generateEmbedding(text) {
  const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

export async function generateEmbeddings(texts) {
  const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
  const embeddings = [];

  // Process in batches of 5 to avoid rate limits
  for (let i = 0; i < texts.length; i += 5) {
    const batch = texts.slice(i, i + 5);
    const results = await Promise.all(
      batch.map((text) => model.embedContent(text))
    );
    embeddings.push(...results.map((r) => r.embedding.values));
  }

  return embeddings;
}
