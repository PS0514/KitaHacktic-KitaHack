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
import { useSwitchScan } from '../hooks/useSwitchScan';
import SwitchOptionList from '../components/SwitchOptionList';
import { generatePatientPhrases } from '../logic/geminiService';
import { useVoiceOut } from '../hooks/useVoiceOut'; // Now updated for Google TTS
import { getActiveKeywords } from '../logic/aiManager';
import Video from 'react-native-video'; // Added for audio playback

/** Modes for our State Machine */
type ScanMode = 'IDLE' | 'SCANNING_OPTIONS' | 'LOADING_GEMINI' | 'SCANNING_SENTENCES';

const HEADER_HEIGHT = 74;

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

  // Destructure audioPath from the updated hook
  const { speak, audioPath } = useVoiceOut();
  const [detectedFromCV, setDetectedFromCV] = useState<string[]>(['Cup', 'Phone']);

  const [scanMode, setScanMode] = useState<ScanMode>('IDLE');
  const [geminiSentences, setGeminiSentences] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentKeywords = getActiveKeywords(detectedFromCV);
  const itemCount =
    scanMode === 'SCANNING_OPTIONS' ? currentKeywords.length :
    scanMode === 'SCANNING_SENTENCES' ? geminiSentences.length : 0;

  const { index, reset } = useSwitchScan(itemCount, 1500);

  const isSpeakingRef = React.useRef(false);

  const handleSwitchPress = async () => {
    if (scanMode === 'IDLE' || isProcessing || isSpeakingRef.current) return;

    const selectedKeyword = currentKeywords[index];
    const finalSentence = geminiSentences[index];

    if (scanMode === 'SCANNING_OPTIONS') {
      setIsProcessing(true);

      // Start speaking immediately
      speak(selectedKeyword.label.toLowerCase());

      // Increase this delay to "Stay" on the button screen longer
      // 1500ms is usually enough for the voice to finish the keyword
      setTimeout(async () => {
        setScanMode('LOADING_GEMINI');

        try {
          const phrases = await generatePatientPhrases(selectedKeyword.label);
          setGeminiSentences(phrases);
          reset();
          setScanMode('SCANNING_SENTENCES');
        } catch (error) {
          setScanMode('IDLE');
        } finally {
          setIsProcessing(false);
        }
      }, 1500);
    }

    else if (scanMode === 'SCANNING_SENTENCES') {
      setIsProcessing(true);
      speak(finalSentence);

      // Stay on the sentence list for 2 seconds while it speaks
      // This prevents the "black screen" jump during audio
      setTimeout(() => {
        setIsProcessing(false);
        setScanMode('IDLE');
        setGeminiSentences([]);
      }, 2000);
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

      <TouchableOpacity
        activeOpacity={1}
        style={styles.fullScreenTouch}
        onPress={handleSwitchPress}
        disabled={scanMode === 'IDLE'}
      >
        <View style={[styles.content, { paddingTop: HEADER_HEIGHT + 8 }]}>

          {/* TOP BUTTON PANEL */}
          <View style={styles.panel}>
            <View style={styles.buttonRow}>
              {currentKeywords.slice(0, 3).map((kw, i) => (
                <EmergencyButton
                  key={kw.id}
                  label={kw.label as any}
                  onPressFallback={() => {}}
                  isScanning={scanMode === 'SCANNING_OPTIONS' && index === i}
                />
              ))}
            </View>

            <View style={[styles.buttonRow, styles.buttonRowBottom]}>
              {currentKeywords.slice(3, 5).map((kw, i) => (
                <EmergencyButton
                  key={kw.id}
                  label={kw.label as any}
                  onPressFallback={() => {}}
                  isScanning={scanMode === 'SCANNING_OPTIONS' && index === (i + 3)}
                />
              ))}
            </View>
          </View>

          {/* MIDDLE AREA: CAMERA or SENTENCES */}
          <View style={styles.cameraCard}>
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
                {scanMode === 'SCANNING_OPTIONS' && (
                  <View style={styles.overlayMessage}>
                    <Text style={styles.overlayText}>Scanning Options... Tap to Select</Text>
                  </View>
                )}
              </View>
            )}

            {scanMode === 'LOADING_GEMINI' && (
              <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Generating responses...</Text>
              </View>
            )}

            {scanMode === 'SCANNING_SENTENCES' && (
              <View style={styles.centerContainer}>
                <Text style={styles.instructionText}>Select a Sentence:</Text>
                <SwitchOptionList
                  items={geminiSentences}
                  activeIndex={index}
                />
              </View>
            )}

            {isProcessing && (
              <View style={styles.maskOverlay}>
                 <ActivityIndicator size="small" color="#FFFF00" />
                 <Text style={styles.maskText}>
                   {scanMode === 'SCANNING_OPTIONS'
                     ? `Selected ${currentKeywords[index].label}...`
                     : "Speaking Sentence..."}
                 </Text>
              </View>
            )}

            {scanMode === 'IDLE' && (
              <View style={styles.startButtonContainer}>
                <TouchableOpacity style={styles.startButton} onPress={() => setScanMode('SCANNING_OPTIONS')}>
                  <Text style={styles.startButtonText}>Start Scanning</Text>
                </TouchableOpacity>
              </View>
            )}

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

      {/* HIDDEN GOOGLE TTS AUDIO PLAYER */}
      {audioPath && (
        <Video
                source={{ uri: 'file://' + audioPath }} // CRITICAL: 'file://' prefix for Android
                audioOnly={true}
                playInBackground={true}
                playWhenInactive={true}
                ignoreSilentSwitch="ignore"
                // This is a hidden element, it shouldn't affect layout
                style={{ width: 0, height: 0, position: 'absolute' }}
                onError={(e) => console.log("Video Player Error:", e)}
                onLoad={() => console.log("Audio file loaded successfully")}
              />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#020617' },
  fullScreenTouch: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 16, paddingBottom: 24, gap: 16 },
  panel: {
      backgroundColor: '#020617',
      borderRadius: 28,
      paddingVertical: 16,
      paddingHorizontal: 8,
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
      paddingHorizontal: 40,
    },
  cameraCard: {
    flex: 1,
    backgroundColor: '#0b1220',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.35)',
    overflow: 'hidden',
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
    maskOverlay: {
      ...StyleSheet.absoluteFillObject, // Covers the whole cameraCard
      backgroundColor: 'rgba(2, 6, 23, 0.85)', // Dark semi-transparent
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10, // Ensures it is on the very top
    },
    maskText: {
      color: '#FFFF00', // Warning yellow stands out
      marginTop: 12,
      fontWeight: 'bold',
      fontSize: 14,
      letterSpacing: 0.5,
    },
  overlayText: { color: '#FFFF00', fontWeight: 'bold' },
  startButtonContainer: { position: 'absolute', bottom: 18, alignSelf: 'center' },
  startButton: {
    paddingHorizontal: 32, paddingVertical: 12, borderRadius: 999,
    backgroundColor: '#3b82f6', shadowColor: '#3b82f6', shadowOpacity: 0.8, shadowRadius: 18,
  },
  startButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
});