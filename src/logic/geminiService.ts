// src/logic/geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "@env";

// Replace with your actual API Key for the hackathon
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const SYSTEM_INSTRUCTION = `
  You are an assistive communication AI for a patient with limited speech.
  The user will provide a "Keyword" representing their intent.
  Your task: Generate 3 short, clear, and natural sentences the patient might want to say.
  Rules:
  1. Sentences must be first-person (starting with "I" or "Me").
  2. Keep them under 10 words.
  3. Output ONLY a JSON array of strings.
  4. Example for Keyword "WATER": ["I am thirsty.", "May I have some water?", "Please help me drink."]
`;

export async function generatePatientPhrases(keyword: string): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Keyword: ${keyword}`;
    const result = await model.generateContent([SYSTEM_INSTRUCTION, prompt]);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON array from Gemini
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback phrases if API fails or rate limits hit
    return [
      `I need ${keyword}.`,
      `Can you help me with ${keyword}?`,
      `I am thinking about ${keyword}.`
    ];
  }
}