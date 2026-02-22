// Standard COCO 80 Labels (Note: '???' handles gaps in some TFLite model mappings)
export const MODEL_LABELS = [
  'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat',
  'traffic light', 'fire hydrant', '???', 'stop sign', 'parking meter', 'bench',
  'bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe',
  '???', 'backpack', 'umbrella', '???', '???', 'handbag', 'tie', 'suitcase', 'frisbee',
  'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove',
  'skateboard', 'surfboard', 'tennis racket', 'bottle', '???', 'wine glass', 'cup',
  'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange', 'broccoli',
  'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed',
  '???', 'dining table', '???', '???', 'toilet', '???', 'tv', 'laptop', 'mouse',
  'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink',
  'refrigerator', '???', 'book', 'clock', 'vase', 'scissors', 'teddy bear',
  'hair drier', 'toothbrush'
];

export type DetectionResult = {
  label: string;
  confidence: number;
  box: [number, number, number, number];
};

export function parseDetections(outputs: any[]): DetectionResult[] {
  'worklet';
  if (!outputs || outputs.length === 0) return [];

  const boxes = outputs[0];
  const classes = outputs[1];
  const scores = outputs[2];
  const count = outputs[3][0];

  const results: DetectionResult[] = [];
  for (let i = 0; i < count; i++) {
    if (scores[i] > 0.45) { // Threshold
      const labelIndex = Math.round(classes[i]);
      results.push({
        label: MODEL_LABELS[labelIndex] || 'object',
        confidence: scores[i],
        box: [boxes[i*4], boxes[i*4+1], boxes[i*4+2], boxes[i*4+3]]
      });
    }
  }
  return results;
}