import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

async function getEmbedding(text) {
  const response = await hf.featureExtraction({
    model: "sentence-transformers/nli-bert-large",
    inputs: text,
  });

  if (Array.isArray(response) && response.every((item) => typeof item === "number")) {
    return response;
  } else if (Array.isArray(response) && Array.isArray(response[0])) {
    return response[0];
  } else if (typeof response === "number") {
    return [response];
  } else {
    throw new Error("Unexpected embedding format");
  }
}

function parseProfessorInfo(text) {
  const professorInfo = {};

  const nameMatch = text.match(/Name:\s*(.*?),\s*Department/);
  const departmentMatch = text.match(/Department:\s*(.*?),\s*Overall/);
  const overallRatingMatch = text.match(/Overall Rating:\s*([\d.]+)/);
  const numberOfRatingsMatch = text.match(/Number of Ratings:\s*(\d+)/);
  const wouldTakeAgainMatch = text.match(/Would Take Again:\s*([\d%]+)/);
  const difficultyMatch = text.match(/Difficulty:\s*([\d.]+)/);
  const topTagsMatch = text.match(/Top Tags:\s*(.*)/);

  professorInfo.name = nameMatch ? nameMatch[1] : null;
  professorInfo.department = departmentMatch ? departmentMatch[1] : null;
  professorInfo.overallRating = overallRatingMatch ? parseFloat(overallRatingMatch[1]) : null;
  professorInfo.numberOfRatings = numberOfRatingsMatch ? parseInt(numberOfRatingsMatch[1], 10) : null;
  professorInfo.wouldTakeAgain = wouldTakeAgainMatch ? wouldTakeAgainMatch[1] : null;
  professorInfo.difficulty = difficultyMatch ? parseFloat(difficultyMatch[1]) : null;
  professorInfo.topTags = topTagsMatch ? topTagsMatch[1].split(',').map(tag => tag.trim()) : [];

  return professorInfo;
}

async function getProfessors() {
  const index = pinecone.Index("professors-index");

  const queryResponse = await index.query({
    vector: await getEmbedding("professor"),
    topK: 1000,
    includeMetadata: true,
  });

  console.log(queryResponse)

  const processedProfessors = queryResponse.matches
    .map(match => ({
      id: match.id,
      score: match.score,
      metadata: parseProfessorInfo(match.metadata.text),
    }))
    .filter(prof => 
      prof.metadata.name &&                                         
      prof.metadata.department &&
      prof.metadata.overallRating !== null &&
      prof.metadata.numberOfRatings !== null
    );

  const uniqueProfessors = Array.from(
    new Map(processedProfessors.map(item => [item.metadata.name, item])).values()
  );

  const sortedProfessors = uniqueProfessors.sort((a, b) => 
    b.metadata.overallRating - a.metadata.overallRating
  );

  console.log(processedProfessors)

  return sortedProfessors.slice(0, 30);
}

export async function GET() {
  try {
    const professors = await getProfessors();
    return NextResponse.json(professors);
  } catch (error) {
    console.error("Error fetching top professors:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the top professors." },
      { status: 500 }
    );
  }
}

async function queryPinecone(userQuery) {
  const index = pinecone.Index("professors-index");
  const queryEmbedding = await getEmbedding(userQuery);
  const queryResponse = await index.query({
    vector: queryEmbedding,
    topK: 5,
    includeMetadata: true,
  });

  return queryResponse.matches.map(match => match.metadata.text);
}

export async function POST(req) {
  try {
    const { userQuery } = await req.json();

    const relevantContext = await queryPinecone(userQuery);

    const primer = `You are a personal assistant. Answer any questions I have about the professor only based on the info I have provided.`;

    const augmented_query = `${relevantContext.join(
      "\n"
    )}\n---------\nquestion:\n${userQuery}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: primer },
        { role: "user", content: augmented_query },
      ],
      temperature: 0.7,
      max_tokens: 1000,
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