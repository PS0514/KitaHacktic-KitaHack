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

import { Camera, useCameraDevice, useCameraFormat } from 'react-native-vision-camera';
import { EmergencyButton } from '../components/EmergencyButton';
import { Header } from '../components/Header';
import { useSwitchScan } from '../hooks/useSwitchScan'; // Ensure this path is correct
import SwitchOptionList from '../components/SwitchOptionList'; // Reuse this for sentences
import { generatePatientPhrases } from '../logic/geminiService';
import { useVoiceOut } from '../hooks/useVoiceOut';
import { getActiveKeywords } from '../logic/aiManager';

/** Modes for our State Machine */
type ScanMode = 'IDLE' | 'SCANNING_OPTIONS' | 'LOADING_GEMINI' | 'SCANNING_SENTENCES';

const HEADER_HEIGHT = 74;

// Update Keyword type to handle dynamic labels from CV
type Keyword = {
  id: string;
  label: string;
};

export function CameraScreen() {
  const device = useCameraDevice('back');

  const format = useCameraFormat(device, [
      { videoResolution: { width: 1280, height: 720 } },
      { videoResolution: { width: 640, height: 480 } },
      { fps: 30 }
    ]);

  const [hasPermission, setHasPermission] = useState(false);

  const { speak } = useVoiceOut();
  const [detectedFromCV, setDetectedFromCV] = useState<string[]>(['Cup', 'Phone']); // Mocked from CV Dev branch

  // 1. STATE MACHINE
  const [scanMode, setScanMode] = useState<ScanMode>('IDLE');
  const [geminiSentences, setGeminiSentences] = useState<string[]>([]);

  // 2. DATA (The 5 Buttons you see on screen)
  // Logic updated: Combine 3 static keywords with top 2 dynamic objects
  const currentKeywords = getActiveKeywords(detectedFromCV);
  const itemCount =
    scanMode === 'SCANNING_OPTIONS' ? currentKeywords.length :
    scanMode === 'SCANNING_SENTENCES' ? geminiSentences.length : 0;
  // 3. SCANNER LOGIC - Removed the onTick callback to prevent overlaps
    const { index, reset } = useSwitchScan(itemCount, 1500);

    // 4. CONFIRM ACTION (The Switch Press)
    const [isProcessing, setIsProcessing] = useState(false);
    const isSpeakingRef = React.useRef(false);

    const handleSwitchPress = async () => {
      if (scanMode === 'IDLE' || isSpeakingRef.current) return;

      const selectedKeyword = currentKeywords[index];
      const finalSentence = geminiSentences[index];

      if (scanMode === 'SCANNING_OPTIONS') {
        console.log("SELECTED:", selectedKeyword.label); // DEBUG LOG

        isSpeakingRef.current = true;
        speak(selectedKeyword.label.toLowerCase());

        setScanMode('LOADING_GEMINI');
        try {
          const phrases = await generatePatientPhrases(selectedKeyword.label);
          setGeminiSentences(phrases);
          reset();
          setScanMode('SCANNING_SENTENCES');
        } catch (error) {
          setScanMode('IDLE');
        } finally {
          // Unlock after 500ms to allow next interaction
          setTimeout(() => { isSpeakingRef.current = false; }, 500);
        }
      }
      else if (scanMode === 'SCANNING_SENTENCES') {
        console.log("FINAL SENTENCE:", finalSentence); // DEBUG LOG

        isSpeakingRef.current = true;
        speak(finalSentence);

        setScanMode('IDLE');
        setGeminiSentences([]);

        setTimeout(() => { isSpeakingRef.current = false; }, 500);
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
  if (!hasPermission || device == null) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Initializing Camera...</Text>
      </View>
    );
  }

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
              {currentKeywords.slice(0, 3).map((kw, i) => (
                <EmergencyButton
                  key={kw.id}
                  label={kw.label as any}
                  onPressFallback={() => {}}
                  // Highlight logic: Are we scanning options? Is this the current index?
                  isScanning={scanMode === 'SCANNING_OPTIONS' && index === i}
                />
              ))}
            </View>

            {/* Row 2: Dynamic Objects (e.g., CUP, PHONE) */}
            <View style={[styles.buttonRow, styles.buttonRowBottom]}>
              {currentKeywords.slice(3, 5).map((kw, i) => (
                <EmergencyButton
                  key={kw.id}
                  label={kw.label as any}
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
                {showCamera && (
                  <Camera
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={scanMode === 'IDLE' || scanMode === 'SCANNING_OPTIONS'}
                    pixelFormat="yuv"
                    audio={false}
                    photo={false}
                    video={false}
                    enableLocation={false}
                    resizeMode="cover"
                  />
                )}

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