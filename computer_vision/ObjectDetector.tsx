import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useFrameProcessor,
  runAtTargetFps
} from 'react-native-vision-camera';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { useResizePlugin } from 'vision-camera-resize-plugin';
import { runOnJS } from 'react-native-reanimated';

// 🏷️ Standard COCO labels (The things the model knows)
const LABELS = [
  '???', 'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat',
  'traffic light', 'fire hydrant', '???', 'stop sign', 'parking meter', 'bench', 'bird', 'cat',
  'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', '???', 'backpack',
  'umbrella', '???', '???', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard',
  'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard',
  'tennis racket', 'bottle', '???', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl',
  'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut',
  'cake', 'chair', 'couch', 'potted plant', 'bed', '???', 'dining table', '???', '???',
  'toilet', '???', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'microwave',
  'oven', 'toaster', 'sink', 'refrigerator', '???', 'book', 'clock', 'vase', 'scissors',
  'teddy bear', 'hair drier', 'toothbrush'
];

export default function ObjectDetector() {
  const device = useCameraDevice('back');
  const [hasPermission, setHasPermission] = useState(false);
  const [latestLabel, setLatestLabel] = useState<string>("Loading Model...");

  // 1. Load the Model
  const objectDetection = useTensorflowModel(require('../assets/object_detection.tflite'));
  const model = objectDetection.state === 'loaded' ? objectDetection.model : undefined;

  // 2. Load the Resize Plugin
  const { resize } = useResizePlugin();

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // UI Updater Helper
  const updateUI = (label: string) => {
    setLatestLabel(label);
  };

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    if (model == null) return;

    // 🏎️ Run at 5 FPS to keep the UI smooth
    runAtTargetFps(5, () => {
      'worklet';

      // 3. Resize Frame (Model needs 320x320 RGB)
      const resized = resize(frame, {
        scale: { width: 320, height: 320 },
        pixelFormat: 'rgb',
        dataType: 'uint8',
      });

      // 4. Run Inference
      // output[0] = boxes, output[1] = classes, output[2] = scores, output[3] = count
      const output = model.runSync([resized]);

      // 5. Parse Results
      const classes = output[1]; // Array of class IDs
      const scores = output[2];  // Array of confidence scores

      // Get the top result (first item in the array)
      const topClassIndex = classes[0];
      const topScore = scores[0];

      // 6. Update UI if confidence > 30%
      if (topScore > 0.3) {
        const labelName = LABELS[topClassIndex] ?? "Unknown";
        const confidence = (topScore * 100).toFixed(0);

        runOnJS(updateUI)(`${labelName} (${confidence}%)`);
        console.log(`Detected: ${labelName}`);
      }
    });
  }, [model, resize]);

  if (!hasPermission) return <View style={styles.center}><Text style={styles.text}>No Camera Permission</Text></View>;
  if (!device) return <View style={styles.center}><Text style={styles.text}>No Camera Device</Text></View>;

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        pixelFormat="yuv" // Standard for Android
      />

      <View style={styles.overlay}>
        <Text style={styles.text}>{latestLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12
  },
  text: { color: 'white', fontSize: 24, fontWeight: 'bold' }
});