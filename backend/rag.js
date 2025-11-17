const { Pinecone } = require("@pinecone-database/pinecone");
const ai = require("./ai");

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

async function initPinecone() {
  // No need to "init" in new SDK
}

async function upsertDocs(docs) {
  const index = pc.Index(process.env.PINECONE_INDEX_NAME);

  const vectors = [];
  for (const d of docs) {
    const emb = await ai.embedText(d.text);
    vectors.push({
      id: d.id,
      values: emb,
      metadata: { title: d.title || "" },
    });
  }

  await index.upsert(vectors);
}

async function querySimilar(text, topK = 3) {
  const index = pc.Index(process.env.PINECONE_INDEX_NAME);
  const emb = await ai.embedText(text);

  const results = await index.query({
    vector: emb,
    topK: topK,
    includeMetadata: true,
  });

  return results.matches || [];
}

module.exports = { initPinecone, upsertDocs, querySimilar };
