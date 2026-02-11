import * as Speech from 'expo-speech';

const speakObject = (label: string) => {
  // Add a safety check in case the native module isn't linked yet
  if (!Speech.speak) {
    console.warn("Speech module not found. Did you rebuild the native app?");
    return;
  }

  Speech.stop();
  Speech.speak(label, {
    language: 'en',
    pitch: 1.0,
    rate: 0.9,
  });
};

export default speakObject;