import { useState } from 'react';
import RNFS from 'react-native-fs';
import axios from 'axios';
import { GOOGLE_TTS_API_KEY } from '@env';

export function useVoiceOut() {
  const [audioPath, setAudioPath] = useState<string | null>(null);

  const speak = async (text: string) => {
    if (!text) return;

    // Create a safe filename (e.g., "i_want_water.mp3")
    const fileName = text.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    const path = `${RNFS.CachesDirectoryPath}/${fileName}.mp3`;

    try {
      // 1. Check if file already exists in cache
      const exists = await RNFS.exists(path);

      if (exists) {
        console.log("🚀 Playing from local cache:", path);
        // "Flicker" the state to ensure the Video component reloads the sound
        setAudioPath(null);
        setTimeout(() => setAudioPath(path), 10);
        return;
      }

      // 2. If not in cache, fetch from Google
      console.log("🌐 Fetching from Google Cloud TTS...");
      const response = await axios.post(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_TTS_API_KEY}`,
        {
          input: { text },
          voice: {
            languageCode: 'en-US',
            name: 'en-US-Neural2-F',
            ssmlGender: 'FEMALE'
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 1.15 // Slightly faster for responsiveness
          },
        }
      );

      // 3. Save the Base64 data to a file
      await RNFS.writeFile(path, response.data.audioContent, 'base64');

      // 4. Play the newly created file
      setAudioPath(null);
      setTimeout(() => setAudioPath(path), 10);

    } catch (error) {
      console.error("❌ TTS Playback Error:", error);
    }
  };

  return { speak, audioPath };
}