// app/api/add-professor/route.js

import { HfInference } from "@huggingface/inference";
import { Pinecone } from "@pinecone-database/pinecone";
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY as string,
});

async function getEmbedding(text) {
  const response = await hf.featureExtraction({
    model: "sentence-transformers/nli-bert-large",
    inputs: text,
  });

  if (
    Array.isArray(response) &&
    response.every((item) => typeof item === "number")
  ) {
    return response;
  } else if (Array.isArray(response) && Array.isArray(response[0])) {
    return response[0];
  } else if (typeof response === "number") {
    return [response];
  } else {
    throw new Error("Unexpected embedding format");
  }
}

async function embedAndStore(text, source) {
  const embedding = await getEmbedding(text);
  const index = pinecone.Index("professors-index");

  await index.upsert([
    {
      id: `${source}-${Date.now()}`,
      values: embedding,
      metadata: { text, source },
    },
  ]);
}

export async function POST(req) {
  const { text, source } = await req.json();

  try {
    await embedAndStore(text, source);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
