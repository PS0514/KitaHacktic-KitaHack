export function getActiveKeywords(detectedObjects: string[]): Keyword[] {
  const STATIC_KEYWORDS: Keyword[] = [
    { id: 'HELP', label: 'HELP', isDynamic: false },
    { id: 'EMERGENCY', label: 'EMERGENCY', isDynamic: false },
    { id: 'PAIN', label: 'PAIN', isDynamic: false },
  ];

  // Map detected objects to Keywords
  const dynamicFromCV = detectedObjects.map(obj => ({
    id: obj.toUpperCase(),
    label: obj.toUpperCase(),
    isDynamic: true,
  }));

  // Create a 5-slot array: [Static, Static, Static, Dynamic, Dynamic]
  const finalKeywords = [...STATIC_KEYWORDS];

  // Fill slots 4 and 5 with detected objects, or "WAITING..." placeholders
  for (let i = 0; i < 2; i++) {
    if (dynamicFromCV[i]) {
      finalKeywords.push(dynamicFromCV[i]);
    } else {
      finalKeywords.push({
        id: `EMPTY_${i}`,
        label: 'SCANNING...',
        isDynamic: true
      });
    }
  }

  return finalKeywords;
}