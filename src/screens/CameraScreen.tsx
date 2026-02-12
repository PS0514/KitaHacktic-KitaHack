import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { EmergencyButton } from '../components/EmergencyButton';
import { Header } from '../components/Header';
import { useSwitchScan } from '../hooks/useSwitchScan'; // Ensure this path is correct
import SwitchOptionList from '../components/SwitchOptionList'; // Reuse this for sentences

/** Modes for our State Machine */
type ScanMode = 'IDLE' | 'SCANNING_OPTIONS' | 'LOADING_GEMINI' | 'SCANNING_SENTENCES';

const HEADER_HEIGHT = 74;

type Keyword = {
  id: string;
  label: 'HELP' | 'EMERGENCY' | 'PAIN' | 'WATER' | 'FOOD';
};

export function CameraScreen() {
  const device = useCameraDevice('back');
  const [hasPermission, setHasPermission] = useState(false);

  // 1. STATE MACHINE
  const [scanMode, setScanMode] = useState<ScanMode>('IDLE');
  const [geminiSentences, setGeminiSentences] = useState<string[]>([]);

  // 2. DATA (The 5 Buttons you see on screen)
  const staticKeywords: Keyword[] = [
    { id: 'HELP', label: 'HELP' },
    { id: 'EMERGENCY', label: 'EMERGENCY' },
    { id: 'PAIN', label: 'PAIN' },
    { id: 'WATER', label: 'WATER' },
    { id: 'FOOD', label: 'FOOD' },
  ];

  // 3. SCANNER LOGIC
  // Determine what we are counting: 5 buttons OR 3 sentences
  const itemCount =
    scanMode === 'SCANNING_OPTIONS' ? staticKeywords.length :
    scanMode === 'SCANNING_SENTENCES' ? geminiSentences.length : 0;

  const { index, reset } = useSwitchScan(itemCount, 1500); // 1.5s speed

  // 4. CONFIRM ACTION (The Switch Press)
  const handleSwitchPress = () => {
    if (scanMode === 'IDLE') return; // Do nothing if not started

    if (scanMode === 'SCANNING_OPTIONS') {
      // User selected one of the 5 top buttons
      const selectedKeyword = staticKeywords[index];
      console.log("SELECTED:", selectedKeyword.label);

      setScanMode('LOADING_GEMINI');

      // MOCK GEMINI CALL (Replace with real API later)
      setTimeout(() => {
        setGeminiSentences([
          `I need ${selectedKeyword.label} immediately.`,
          `Where is the ${selectedKeyword.label}?`,
          `Please bring me ${selectedKeyword.label}.`
        ]);
        reset(); // Reset scanner to 0
        setScanMode('SCANNING_SENTENCES');
      }, 2000);
    }
    else if (scanMode === 'SCANNING_SENTENCES') {
      // User selected a final sentence
      const finalSentence = geminiSentences[index];
      console.log("FINAL SENTENCE:", finalSentence);

      // Reset everything
      setScanMode('IDLE');
      setGeminiSentences([]);
    }
  };

  useEffect(() => {
    async function init() {
      const permission = await Camera.requestCameraPermission();
      setHasPermission(permission === 'granted');
    }
    init();
  }, []);

  const showCamera = hasPermission && device != null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <Header />

      {/* THE WHOLE SCREEN IS A TOUCHABLE SWITCH
         Only active when scanning.
      */}
      <TouchableOpacity
        activeOpacity={1}
        style={styles.fullScreenTouch}
        onPress={handleSwitchPress}
        disabled={scanMode === 'IDLE'}
      >
        <View style={[styles.content, { paddingTop: HEADER_HEIGHT + 8 }]}>

          {/* --- TOP BUTTON PANEL --- */}
          <View style={styles.panel}>
            {/* Row 1: HELP, EMERGENCY, PAIN */}
            <View style={styles.buttonRow}>
              {staticKeywords.slice(0, 3).map((kw, i) => (
                <EmergencyButton
                  key={kw.id}
                  label={kw.label}
                  onPressFallback={() => {}}
                  // Highlight logic: Are we scanning options? Is this the current index?
                  isScanning={scanMode === 'SCANNING_OPTIONS' && index === i}
                />
              ))}
            </View>

            {/* Row 2: WATER, FOOD */}
            <View style={[styles.buttonRow, styles.buttonRowBottom]}>
              {staticKeywords.slice(3, 5).map((kw, i) => (
                <EmergencyButton
                  key={kw.id}
                  label={kw.label}
                  onPressFallback={() => {}}
                  // Offset index by 3 because this is the second row
                  isScanning={scanMode === 'SCANNING_OPTIONS' && index === (i + 3)}
                />
              ))}
            </View>
          </View>


          {/* --- MIDDLE AREA: CAMERA or SENTENCES --- */}
          <View style={styles.cameraCard}>

            {/* SCENARIO A: CAMERA (Default) */}
            {(scanMode === 'IDLE' || scanMode === 'SCANNING_OPTIONS') && (
              <View style={styles.cameraInner}>
                {showCamera && <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />}

                {/* Visual Feedback for Scanning */}
                {scanMode === 'SCANNING_OPTIONS' && (
                  <View style={styles.overlayMessage}>
                    <Text style={styles.overlayText}>Scanning Options... Tap to Select</Text>
                  </View>
                )}
              </View>
            )}

            {/* SCENARIO B: LOADING */}
            {scanMode === 'LOADING_GEMINI' && (
              <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Generating responses...</Text>
              </View>
            )}

            {/* SCENARIO C: SENTENCE SELECTION */}
            {scanMode === 'SCANNING_SENTENCES' && (
              <View style={styles.centerContainer}>
                <Text style={styles.instructionText}>Select a Sentence:</Text>
                <SwitchOptionList
                  items={geminiSentences}
                  activeIndex={index} // Reuse your existing list component
                />
              </View>
            )}

            {/* START BUTTON (Only visible when IDLE) */}
            {scanMode === 'IDLE' && (
              <View style={styles.startButtonContainer}>
                <TouchableOpacity style={styles.startButton} onPress={() => setScanMode('SCANNING_OPTIONS')}>
                  <Text style={styles.startButtonText}>Start Scanning</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* CANCEL BUTTON (Visible when scanning) */}
            {scanMode !== 'IDLE' && (
               <View style={styles.startButtonContainer}>
                <TouchableOpacity style={[styles.startButton, {backgroundColor: '#333'}]} onPress={() => setScanMode('IDLE')}>
                  <Text style={styles.startButtonText}>Stop / Reset</Text>
                </TouchableOpacity>
              </View>
            )}

          </View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#020617' },
  fullScreenTouch: { flex: 1 }, // Covers whole screen for switch access
  content: { flex: 1, paddingHorizontal: 16, paddingBottom: 24, gap: 16 },

  panel: {
      backgroundColor: '#020617',
      borderRadius: 28,
      paddingVertical: 16,
      paddingHorizontal: 8, // Reduced padding so buttons have more space
      borderWidth: 1,
      borderColor: 'rgba(30,64,175,0.4)',
    },

    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    buttonRowBottom: {
      marginTop: 12,
      flexDirection: 'row',
      paddingHorizontal: 40, // <--- Add padding here to make bottom buttons narrower
    },

  cameraCard: {
    flex: 1,
    backgroundColor: '#0b1220',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.35)',
    overflow: 'hidden', // Clips the camera corners
  },
  cameraInner: { flex: 1 },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: { color: 'white', marginTop: 10 },
  instructionText: { color: '#94a3b8', marginBottom: 20 },

  overlayMessage: {
    position: 'absolute', top: 20, alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)', padding: 10, borderRadius: 8
  },
  overlayText: { color: '#FFFF00', fontWeight: 'bold' },

  startButtonContainer: { position: 'absolute', bottom: 18, alignSelf: 'center' },
  startButton: {
    paddingHorizontal: 32, paddingVertical: 12, borderRadius: 999,
    backgroundColor: '#3b82f6', shadowColor: '#3b82f6', shadowOpacity: 0.8, shadowRadius: 18,
  },
  startButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
});