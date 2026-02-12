// src/hooks/useVoiceOut.ts
import Tts from 'react-native-tts';

export function useVoiceOut() {
  const speak = (text: string) => {
    if (!text) return;

    // Remove the setTimeout to make it instant
    Tts.stop();
    Tts.speak(text, {
      androidParams: {
        KEY_PARAM_STREAM: 'STREAM_MUSIC',
        KEY_PARAM_VOLUME: 1,
      },
    });
  };

  return { speak };
}