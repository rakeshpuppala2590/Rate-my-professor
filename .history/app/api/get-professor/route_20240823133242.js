import { HfInference } from "@huggingface/inference";

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

    const primer = `You are a personal assistant. Answer any questions I have about the prfoessor by using the info i have provided.`;

    const augmented_query = `${relevantContext.join(
      "\n"
    )}\n---------\nquestion:\n${userQuery}`;

    const completion = await openai.chat.completions.create({
      model: "mistralai/mistral-nemo",
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
