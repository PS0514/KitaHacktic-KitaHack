let currentTarget: string | null = null;
let startTime = 0;

export function updateSelection(
  gaze: "LEFT" | "RIGHT" | "CENTER",
  targets: string[]
): string | null {
  const now = Date.now();

  const target =
    gaze === "LEFT" ? targets[0] :
    gaze === "RIGHT" ? targets[1] :
    null;

  if (!target) {
    currentTarget = null;
    return null;
  }

  if (currentTarget !== target) {
    currentTarget = target;
    startTime = now;
    return null;
  }

  if (now - startTime > 1200) {
    currentTarget = null;
    return target;
  }

  return null;
}

console.log("Selected:", selected);