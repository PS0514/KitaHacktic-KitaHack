import RNFS from 'react-native-fs';
import { GEMINI_API_KEY } from '@env';

export async function detectObjectWithGemini(photoPath: string): Promise<string> {

  try {

    const base64Image =
      await RNFS.readFile(photoPath, 'base64');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    "What is the main object in this image? " +
                    "Answer ONLY with a single specific noun. " +
                    "Examples: cup, phone, laptop, person, bottle. " +
                    "Do NOT say object, item, or thing."
                },
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: base64Image
                  }
                }
              ]
            }
          ]
        }),
      }
    );

    const result = await response.json();

    const detected =
      result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!detected)
      return "OBJECT";

    return detected
      .trim()
      .toUpperCase();

  } catch (error) {

    console.log("Gemini Vision Error:", error);

    return "OBJECT";

  }

}