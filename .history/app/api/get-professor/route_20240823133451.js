import { HfInference } from "@huggingface/inference";
import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

async function queryPinecone(query) {
  const q_embedding = await getEmbedding(query);
  const index = pinecone.Index("professors-index");

  const queryResponse = await index.query({
    vector: q_embedding,
    topK: 3,
    includeMetadata: true,
  });

  return queryResponse.matches
    .filter((match) => match.metadata?.text)
    .map((match) => match.metadata?.text || "");
}

export async function POST(req) {
  try {
    const { userQuery } = await req.json();

    const relevantContext = await queryPinecone(userQuery);

    const primer = `You are a personal assistant. Answer any questions I have about the professor by using the info I have provided.`;

    const augmented_query = `${relevantContext.join(
      "\n"
    )}\n---------\nquestion:\n${userQuery}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // You can change this to a different model if needed
      messages: [
        { role: "system", content: primer },
        { role: "user", content: augmented_query },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    return NextResponse.json(completion.choices[0].message.content);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
