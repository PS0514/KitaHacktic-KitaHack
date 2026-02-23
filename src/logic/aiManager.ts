// Persistent state outside the function to track the two dynamic slots
let stableDynamicSlots: (string | null)[] = [null, null];
let nextReplaceIndex = 0; // Tracks which slot to replace next (0 or 1)

export function getActiveKeywords(detectedObjects: string[]): Keyword[] {
  const STATIC_KEYWORDS: Keyword[] = [
    { id: 'HELP', label: 'HELP', isDynamic: false },
    { id: 'EMERGENCY', label: 'EMERGENCY', isDynamic: false },
    { id: 'PAIN', label: 'PAIN', isDynamic: false },
  ];

  // 1. Get current unique labels from the AI scanner
  const currentDetected = [...new Set(detectedObjects.map(o => o.toUpperCase()))];

  // 2. Logic: If we see something new that isn't already in one of our slots
  currentDetected.forEach((newObj) => {
    // Check if this object is already displayed in either Slot 1 or Slot 2
    const alreadyDisplayed = stableDynamicSlots.includes(newObj);

    if (!alreadyDisplayed) {
      // Replace the current target slot with the new object
      stableDynamicSlots[nextReplaceIndex] = newObj;

      // Move the "pointer" to the next slot (Toggle between 0 and 1)
      nextReplaceIndex = (nextReplaceIndex + 1) % 2;
    }
  });

  // 3. Map the slots to the Keyword format
  const dynamicKeywords: Keyword[] = stableDynamicSlots.map((obj, index) => {
    if (obj) {
      return {
        id: `${obj}_SLOT_${index}`, // Unique ID based on slot index
        label: obj,
        isDynamic: true,
      };
    }
    // Show placeholder if slot has never been filled
    return {
      id: `SCANNING_${index}`,
      label: 'SCANNING.',
      isDynamic: true,
    };
  });

  return [...STATIC_KEYWORDS, ...dynamicKeywords];
}