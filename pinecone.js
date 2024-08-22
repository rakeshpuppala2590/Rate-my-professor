"use client"

import { PineconeClient } from '@pinecone-database/pinecone';

const pinecone = new PineconeClient();

async function initPinecone() {
  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });
}

initPinecone();

export default pinecone;
