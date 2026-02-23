import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';

// Vision and Camera hooks
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useFrameProcessor,
  runAtTargetFps
} from 'react-native-vision-camera';

// AI and Performance plugins
import { useTensorflowModel } from 'react-native-fast-tflite';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import {Worklets } from 'react-native-worklets-core';

// Internal Components
import { EmergencyButton } from '../components/EmergencyButton';
import { Header } from '../components/Header';
import SwitchOptionList from '../components/SwitchOptionList';

// Logic and Services
import { generatePatientPhrases } from '../logic/geminiService';
import { getActiveKeywords } from '../logic/aiManager';
import { parseDetections, DetectionResult } from '../logic/cvManager';
import { describeRoomWithGemini } from '../logic/geminiVision';

// Hooks and Multimedia
import { useVoiceOut } from '../hooks/useVoiceOut';
import { useSwitchScan } from '../hooks/useSwitchScan';
import Video from 'react-native-video';

/** Modes for our State Machine */
type ScanMode = 'IDLE' | 'SCANNING_OPTIONS' | 'LOADING_GEMINI' | 'SCANNING_SENTENCES';

const HEADER_HEIGHT = 74;
const arraysEqual = (a: string[], b: string[]) =>
  a.length === b.length && a.every((val, index) => val === b[index]);

export function CameraScreen() {
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('back');

  // 1. Camera & Plugin Setup
  const format = useCameraFormat(device, [
    { videoResolution: { width: 1280, height: 720 } },
    { fps: 30 }
  ]);

  const [hasPermission, setHasPermission] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'loading' | 'granted' | 'denied'>('loading');
  const { speak, audioPath } = useVoiceOut();
  const { resize } = useResizePlugin();

  // 2. State Management
  const [detectedFromCV, setDetectedFromCV] = useState<string[]>(['Cup', 'Phone']);
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const [scanMode, setScanMode] = useState<ScanMode>('IDLE');
  const [geminiSentences, setGeminiSentences] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  // 3. Switch Scanning Logic
  const currentKeywords = getActiveKeywords(detectedFromCV);
  const itemCount = isProcessing ? 0 : (
      scanMode === 'SCANNING_OPTIONS' ? currentKeywords.length :
      scanMode === 'SCANNING_SENTENCES' ? geminiSentences.length : 0
  );

  const { index, reset } = useSwitchScan(itemCount, isProcessing, 1500);

  // 4. Load TFLite Model
  const model = useTensorflowModel(require('../assets/model.tflite'));
  const syncStateToJS = Worklets.createRunOnJS((newLabels: string[], newResults: any[]) => {
      // This runs on the Main JS Thread
      setDetections(newResults);
      setDetectedFromCV(prev => {
        if (arraysEqual(prev, newLabels)) return prev;
        return newLabels;
      });
    });

    // 5. High-Performance Frame Processor
    const frameProcessor = useFrameProcessor((frame) => {
      'worklet';
      if (model.state !== 'loaded' || !model.model) return;

      runAtTargetFps(2, () => {
        'worklet';
        try {
          const activeModel = model.model;
          const resized = resize(frame, {
            scale: { width: 300, height: 300 },
            pixelFormat: 'rgb',
            dataType: 'uint8',
          });

          const outputs = activeModel.runSync([resized]);
          const results = parseDetections(outputs);

          if (results && results.length > 0) {
            const labels = results.map(d => d.label);

            // 3. Call the bridge instead of raw runOnJS
            syncStateToJS(labels, results);
          }
        } catch (e) {
          console.log("Inference Error:", e);
        }
      });
    }, [model]);

  // 6. Gemini Vision "Room Scan" implementation
  const handleFullRoomScan = async () => {
    if (!camera.current) return;
    setIsAiAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const photo = await camera.current.takePhoto();
      const aiObjects = await describeRoomWithGemini(photo.path);
      setDetectedFromCV(prev => [...new Set([...prev, ...aiObjects])]);
    } catch (error) {
      console.error("Gemini Scan Error:", error);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  // 7. Input/Selection Handling
  const handleSwitchPress = async () => {
    if (scanMode === 'IDLE' || isProcessing) return;

    const selectedKeyword = currentKeywords[index];
    const finalSentence = geminiSentences[index];

    if (scanMode === 'SCANNING_OPTIONS') {
      setIsProcessing(true);
      speak(selectedKeyword.label.toLowerCase());

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
      setTimeout(() => {
        setIsProcessing(false);
        setScanMode('IDLE');
        setGeminiSentences([]);
        reset();
      }, 2500);
    }
  };

  useEffect(() => {
      let isMounted = true;

      async function init() {
        const status = await Camera.getCameraPermissionStatus();
        if (isMounted) {
          if (status === 'granted') {
            setHasPermission(true);
            setPermissionStatus('granted');
          } else {
            const result = await Camera.requestCameraPermission();
            const isGranted = result === 'granted';
            setHasPermission(isGranted);
            setPermissionStatus(isGranted ? 'granted' : 'denied');
          }
        }
      }
      init();

      // --- CLEANUP FUNCTION START ---
      return () => {
        isMounted = false;

        // 1. Force the scanning mode to IDLE to stop the UI from requesting frames
        setScanMode('IDLE');

        // 2. Clear any pending detections to free up JS memory
        setDetections([]);

        console.log("MindLens: Resources safely released from Pixel 7.");
      };
      // --- CLEANUP FUNCTION END ---
    }, []);

  if (!hasPermission || device == null) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Initializing MindLens...</Text>
      </View>
    );
  }

if (permissionStatus === 'loading' || device == null) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Initializing MindLens...</Text>
      </View>
    );
  }

  if (permissionStatus === 'denied') {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Camera permission is required for AI detection.</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => Linking.openSettings()} // Direct user to system settings
        >
          <Text style={styles.startButtonText}>Open Settings</Text>
        </TouchableOpacity>
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

          {/* TOP BUTTON PANEL - Always shows 5 buttons now */}
          <View style={styles.panel}>
            <View style={styles.buttonRow}>
              {currentKeywords.slice(0, 3).map((kw, i) => (
                <EmergencyButton
                  key={kw.id}
                  label={kw.label as any}
                  isScanning={scanMode === 'SCANNING_OPTIONS' && index === i}
                />
              ))}
            </View>

            <View style={[styles.buttonRow, styles.buttonRowBottom]}>
              {currentKeywords.slice(3, 5).map((kw, i) => (
                <EmergencyButton
                  key={kw.id}
                  label={kw.label as any}
                  // index 3 and 4 correspond to the 2 dynamic slots
                  isScanning={scanMode === 'SCANNING_OPTIONS' && index === (i + 3)}
                />
              ))}
            </View>
          </View>

          {/* MIDDLE AREA: CAMERA or SENTENCES */}
          <View style={styles.cameraCard}>
            {(scanMode === 'IDLE' || scanMode === 'SCANNING_OPTIONS') && (
              <View style={styles.cameraInner}>
                <Camera
                  ref={camera}
                  style={StyleSheet.absoluteFill}
                  device={device}
                  // FORCE TRUE to open webcam immediately on launch
                  isActive={hasPermission && permissionStatus === 'granted'}
                  // Only attach the processor when the user clicks "Start Scanning"
                  //frameProcessor={scanMode === 'SCANNING_OPTIONS' ? frameProcessor : undefined}
                  frameProcessor={(!isCapturing && scanMode === 'SCANNING_OPTIONS') ? frameProcessor : undefined}
                  pixelFormat="yuv"
                  photo={true}
                  onInitialized={() => console.log("Camera Hardware Linked!")}
                  onError={(e) => Worklets.runOnJS(console.error)("Hardware Error:", e)}
                />

{/* UI indicator to tell the user the camera is warming up */}
  {permissionStatus === 'loading' && (
    <View style={styles.maskOverlay}>
      <ActivityIndicator size="large" color="#FFFF00" />
      <Text style={styles.maskText}>Waking up Camera...</Text>
    </View>
  )}

                {model.state !== 'loaded' && (
                    <View style={styles.overlayMessage}>
                      <Text style={styles.overlayText}>AI Brain Initializing...</Text>
                    </View>
                  )}

                {/* Render Detection Bounding Boxes */}
                {detections.map((d, i) => (
                  <View
                    key={`box-${d.label}-${i}`}
                    style={[styles.cvBox, {
                      top: `${d.box[0] * 100}%`,
                      left: `${d.box[1] * 100}%`,
                      width: `${(d.box[3] - d.box[1]) * 100}%`,
                      height: `${(d.box[2] - d.box[0]) * 100}%`
                    }]}
                  >
                    <Text style={styles.cvLabel}>{d.label}</Text>
                  </View>
                ))}

                {scanMode === 'SCANNING_OPTIONS' && (
                  <View style={styles.overlayMessage}>
                    <Text style={styles.overlayText}>Scanning... Tap to Select</Text>
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
                <SwitchOptionList items={geminiSentences} activeIndex={index} />
              </View>
            )}

            {isProcessing && (
              <View style={styles.maskOverlay}>
                 <ActivityIndicator size="small" color="#FFFF00" />
                 <Text style={styles.maskText}>
                   {scanMode === 'SCANNING_OPTIONS'
                     ? `Selected ${currentKeywords[index]?.label}...`
                     : "Speaking Sentence..."}
                 </Text>
              </View>
            )}

            {scanMode === 'IDLE' && (
              <View style={styles.startButtonContainer}>
                {/* Main Start Button */}
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={async () => {
                    setScanMode('SCANNING_OPTIONS');
                    // Automate the Room Scan when scanning starts
                    const aiLabels = await handleFullRoomScan();
                  }}
                >
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

      {audioPath && (
        <Video
          source={{ uri: 'file://' + audioPath }}
          audioOnly={true}
          playInBackground={true}
          playWhenInactive={true}
          ignoreSilentSwitch="ignore"
          style={{ width: 0, height: 0, position: 'absolute' }}
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
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  buttonRowBottom: { marginTop: 12, flexDirection: 'row', paddingHorizontal: 40 },
  cameraCard: {
    flex: 1,
    backgroundColor: '#0b1220',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.35)',
    overflow: 'hidden',
  },
  cameraInner: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { color: 'white', marginTop: 10 },
  instructionText: { color: '#94a3b8', marginBottom: 20 },
  overlayMessage: { position: 'absolute', top: 20, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.7)', padding: 10, borderRadius: 8 },
  maskOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(2, 6, 23, 0.85)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  maskText: { color: '#FFFF00', marginTop: 12, fontWeight: 'bold', fontSize: 14, letterSpacing: 0.5 },
  overlayText: { color: '#FFFF00', fontWeight: 'bold' },
  startButtonContainer: { position: 'absolute', bottom: 18, alignSelf: 'center' },
  startButton: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 999, backgroundColor: '#3b82f6' },
  startButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  cvBox: { position: 'absolute', borderWidth: 2, borderColor: '#FFD700', borderRadius: 4, zIndex: 5 },
  cvLabel: { backgroundColor: '#FFD700', color: '#000', fontSize: 10, fontWeight: 'bold', paddingHorizontal: 2, position: 'absolute', top: -16 },
});

console.log("Is Hermes Active?: ", !!global.HermesInternal);