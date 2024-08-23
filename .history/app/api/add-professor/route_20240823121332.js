// app/api/add-professor/route.js

import pinecone from "@/lib/pinecone-client";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
async function getEmbedding(text) {
  const response = await hf.featureExtraction({
    model: "sentence-transformers/nli-bert-large",
    inputs: text,
  });

  if (
    Array.isArray(response) &&
    response.every((item) => typeof item === "number")
  ) {
    return response as number[];
  } else if (Array.isArray(response) && Array.isArray(response[0])) {
    return response[0] as number[];
  } else if (typeof response === "number") {
    return [response];
  } else {
    throw new Error("Unexpected embedding format");
  }
}

export async function POST(req) {
  const textInput = await req.text();

  // Example embedding (normally, you'd generate this with an embedding model)

  const index = pinecone.Index("professors-index");
  const upsertResponse = await index.upsert({
    vectors: [
      {
        id: name,
        values: embedding,
        metadata: {
          department,
          ratings,
          reviews,
        },
      },
    ],
  });

  return new Response(JSON.stringify(upsertResponse), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
