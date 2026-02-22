import { GEMINI_API_KEY } from "@env";
import RNFS from 'react-native-fs';

export async function describeRoomWithGemini(imagePath: string): Promise<string[]> {
  try {
    const base64Image = await RNFS.readFile(imagePath, 'base64');

    // Using v1 stable endpoint
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const body = {
      contents: [{
        parts: [
          { text: "List 3 objects in this photo. Return ONLY a JSON array of strings. Example: ['Water', 'Medicine', 'Cup']" },
          { inlineData: { mimeType: "image/jpeg", data: base64Image } }
        ]
      }],
      generationConfig: {
        // Corrected naming convention for the API
        response_mime_type: "application/json"
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return ["Cup", "Phone"]; // Fallback if API fails
    }

    const textResult = data.candidates[0].content.parts[0].text;
    // Remove potential markdown code blocks like ```json
    const cleanJson = textResult.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);

  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return ["Cup", "Phone"];
  }
}