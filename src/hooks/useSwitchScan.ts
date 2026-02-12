// src/hooks/useSwitchScan.ts
import { useEffect, useState } from 'react';

export function useSwitchScan(count: number, isProcessing: boolean, intervalMs = 1200) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (count <= 0 || isProcessing) {
          return;
        }

    const timer = setInterval(() => {
        console.log("⏰ TICK! Index moving...");
      setIndex(prev => (prev + 1) % count);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [count, intervalMs, isProcessing]);

  const reset = () => setIndex(0);

  return { index, reset };
}