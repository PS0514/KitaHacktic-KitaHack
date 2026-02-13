// src/logic/geminiService.ts
import { GEMINI_API_KEY } from "@env";

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
    // We use the REST API endpoint directly to avoid React Native Node.js conflicts
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

    const requestBody = {
      systemInstruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }]
      },
      contents: [
        {
          parts: [{ text: `Keyword: ${keyword}` }]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Extract the text from the Gemini response structure
    const text = data.candidates[0].content.parts[0].text;

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