const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const EMBEDDING_MODEL = 'text-embedding-004';

async function buildIndex() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Error: GEMINI_API_KEY environment variable is required');
    console.error('Usage: GEMINI_API_KEY=your-key npm run build-embeddings');
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });

  // Load knowledge base
  const kbPath = path.join(__dirname, '..', 'data', 'knowledge-base.json');
  const kb = JSON.parse(fs.readFileSync(kbPath, 'utf-8'));

  console.log(`Generating embeddings for ${kb.documents.length} documents...`);

  const indexDocuments = [];

  // Process in batches of 5
  for (let i = 0; i < kb.documents.length; i += 5) {
    const batch = kb.documents.slice(i, i + 5);
    console.log(`  Processing batch ${Math.floor(i / 5) + 1}/${Math.ceil(kb.documents.length / 5)}...`);

    const results = await Promise.all(
      batch.map(async (doc) => {
        const textToEmbed = `${doc.title}: ${doc.content}`;
        const result = await model.embedContent(textToEmbed);
        return {
          id: doc.id,
          category: doc.category,
          title: doc.title,
          content: doc.content,
          embedding: result.embedding.values,
        };
      })
    );

    indexDocuments.push(...results);

    // Small delay between batches to respect rate limits
    if (i + 5 < kb.documents.length) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  const index = {
    model: EMBEDDING_MODEL,
    dimension: indexDocuments[0].embedding.length,
    count: indexDocuments.length,
    built_at: new Date().toISOString(),
    documents: indexDocuments,
  };

  const outputPath = path.join(__dirname, '..', 'data', 'embeddings-index.json');
  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2));

  console.log(`\nEmbeddings index built successfully!`);
  console.log(`  Documents: ${index.count}`);
  console.log(`  Dimension: ${index.dimension}`);
  console.log(`  Output: ${outputPath}`);
}

buildIndex().catch((err) => {
  console.error('Failed to build embeddings index:', err);
  process.exit(1);
});
