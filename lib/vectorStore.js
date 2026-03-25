import fs from 'fs';
import path from 'path';

const INDEX_PATH = path.join(process.cwd(), 'data', 'embeddings-index.json');

function cosineSimilarity(a, b) {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

let cachedIndex = null;

export function loadIndex() {
  if (cachedIndex) return cachedIndex;

  if (!fs.existsSync(INDEX_PATH)) {
    throw new Error(
      'Embeddings index not found. Run `npm run build-embeddings` first.'
    );
  }

  cachedIndex = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf-8'));
  return cachedIndex;
}

export function saveIndex(index) {
  fs.writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2));
  cachedIndex = index;
}

export function search(queryEmbedding, topK = 5) {
  const index = loadIndex();

  const scored = index.documents.map((doc) => ({
    ...doc,
    score: cosineSimilarity(queryEmbedding, doc.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK).map(({ embedding, ...rest }) => rest);
}
