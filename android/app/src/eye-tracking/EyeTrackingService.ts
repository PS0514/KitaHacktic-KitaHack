export type EyeDirection = "LEFT" | "RIGHT" | "CENTER" | "BLINK";

export interface EyeTrackingResult {
  direction: EyeDirection;
  blink: boolean;
}

export function processFaceLandmarks(landmarks: any[]): EyeTrackingResult {
  // Placeholder logic (to be improved)
  return {
    direction: "CENTER",
    blink: false,
  };
}

function distance(a: any, b: any) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function isBlinking(eye: any[]) {
  const vertical = distance(eye[1], eye[5]);
  const horizontal = distance(eye[0], eye[3]);
  return vertical / horizontal < 0.2;
}

function getEyeDirection(eye: any[]) {
  const left = eye[0];
  const right = eye[3];
  const iris = eye[2];

  const ratio = (iris.x - left.x) / (right.x - left.x);

  if (ratio < 0.35) return "LEFT";
  if (ratio > 0.65) return "RIGHT";
  return "CENTER";
}

export function processFaceLandmarks(landmarks: any[]): EyeTrackingResult {
  const leftEye = [
    landmarks[33],
    landmarks[159],
    landmarks[468],
    landmarks[133],
    landmarks[145],
    landmarks[153],
  ];

  const blink = isBlinking(leftEye);
  const direction = blink ? "BLINK" : getEyeDirection(leftEye);

  return { direction, blink };
}

console.log("Eye:", direction);