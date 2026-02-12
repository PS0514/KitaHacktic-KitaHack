export async function fetchGeminiSentences(
  option: string
): Promise<string[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        `${option} – example sentence 1`,
        `${option} – example sentence 2`,
        `${option} – example sentence 3`,
      ]);
    }, 1000);
  });
}
