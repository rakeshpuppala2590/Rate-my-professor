// app/api/add-professor/route.js

import { HfInference } from "@huggingface/inference";
import { Pinecone } from "@pinecone-database/pinecone";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
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

async function splitText(text) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 100,
  });
  return await splitter.splitText(text);
}

async function embedAndStore(chunks, source) {
  const index = pinecone.Index("professors-index");

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const embedding = await getEmbedding(chunk);

    await index.upsert([
      {
        id: `${source}-${Date.now()}-${i}`,
        values: embedding,
        metadata: { text: chunk, source, chunkIndex: i },
      },
    ]);
  }
}

export async function POST(req) {
  const { text, source, chunkIndex, totalChunks } = await req.json();

  try {
    const chunks = await splitText(text);
    await embedAndStore(chunks, source);

    return new Response(
      JSON.stringify({
        success: true,
        chunks: chunks.length,
        processedChunk: chunkIndex + 1,
        totalChunks: totalChunks,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
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
