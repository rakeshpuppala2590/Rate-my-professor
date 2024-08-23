// app/api/add-professor/route.js

import pinecone from "@/lib/pinecone-client";

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
