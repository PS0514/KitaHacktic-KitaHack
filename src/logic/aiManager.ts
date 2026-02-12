// src/logic/aiManager.ts

export type Keyword = {
  id: string;
  label: string;
  isDynamic: boolean;
};

const STATIC_KEYWORDS: Keyword[] = [
  { id: 'HELP', label: 'HELP', isDynamic: false },
  { id: 'EMERGENCY', label: 'EMERGENCY', isDynamic: false },
  { id: 'PAIN', label: 'PAIN', isDynamic: false },
];

/**
 * Combines static keywords with the top 2 detected objects
 * @param detectedObjects Array of labels from CV Dev (sorted by proximity/confidence)
 */
export function getActiveKeywords(detectedObjects: string[]): Keyword[] {
  const dynamicKeywords: Keyword[] = detectedObjects
    .slice(0, 2)
    .map(obj => ({
      id: obj.toUpperCase(),
      label: obj.toUpperCase(),
      isDynamic: true,
    }));

  return [...STATIC_KEYWORDS, ...dynamicKeywords];
}