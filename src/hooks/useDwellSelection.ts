import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

export type SelectableType = 'object' | 'emergency';

type ActiveSelection = {
  id: string;
  type: SelectableType;
  label: string;
};

type Options = {
  dwellDurationMs?: number;
  cooldownMs?: number;
  onConfirm: (payload: ActiveSelection) => void;
};

export function useDwellSelection({
  dwellDurationMs = 1500,
  cooldownMs = 1000,
  onConfirm,
}: Options) {
  const [active, setActive] = useState<ActiveSelection | null>(null);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);

  const progress = useRef(new Animated.Value(0)).current;
  const dwellTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cooldownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearDwellTimeout = () => {
    if (dwellTimeoutRef.current) {
      clearTimeout(dwellTimeoutRef.current);
      dwellTimeoutRef.current = null;
    }
  };

  const clearCooldownTimeout = () => {
    if (cooldownTimeoutRef.current) {
      clearTimeout(cooldownTimeoutRef.current);
      cooldownTimeoutRef.current = null;
    }
  };

  const resetProgress = () => {
    progress.stopAnimation();
    progress.setValue(0);
  };

  const startProgress = () => {
    resetProgress();
    Animated.timing(progress, {
      toValue: 1,
      duration: dwellDurationMs,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const startCooldown = useCallback(() => {
    setCooldown(true);
    clearCooldownTimeout();
    cooldownTimeoutRef.current = setTimeout(() => {
      setCooldown(false);
      setConfirmedId(null);
    }, cooldownMs);
  }, [cooldownMs]);

  const startDwell = useCallback(
    (payload: ActiveSelection) => {
      if (cooldown) {
        return;
      }
      if (active && active.id === payload.id && active.type === payload.type) {
        return;
      }

      setActive(payload);
      setConfirmedId(null);
      clearDwellTimeout();
      startProgress();

      dwellTimeoutRef.current = setTimeout(() => {
        setConfirmedId(payload.id);
        setActive(null);
        resetProgress();
        onConfirm(payload);
        startCooldown();
      }, dwellDurationMs);
    },
    [active, cooldown, dwellDurationMs, onConfirm, startCooldown],
  );

  const cancelDwell = useCallback(() => {
    setActive(null);
    clearDwellTimeout();
    resetProgress();
  }, []);

  useEffect(
    () => () => {
      clearDwellTimeout();
      clearCooldownTimeout();
    },
    [],
  );

  return {
    active,
    confirmedId,
    cooldown,
    progress,
    startDwell,
    cancelDwell,
  };
}

