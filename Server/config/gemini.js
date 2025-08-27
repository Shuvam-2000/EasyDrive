import { GoogleGenAI } from '@google/genai';
import { configDotenv } from 'dotenv';

configDotenv();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API })

async function main(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  return(response.text)
}

export default main;