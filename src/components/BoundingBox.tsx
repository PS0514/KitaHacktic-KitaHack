import React, { memo } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export type Detection = {
  id: string;
  label: string;
  confidence: number;
  // normalized [0,1] coordinates relative to preview
  x: number;
  y: number;
  width: number;
  height: number;
};

type Props = {
  detection: Detection;
  containerWidth: number;
  containerHeight: number;
  isActive: boolean;
  isConfirmed: boolean;
  dwellProgress: number; // 0–1
};

function BoundingBoxComponent({
  detection,
  containerWidth,
  containerHeight,
  isActive,
  isConfirmed,
  dwellProgress,
}: Props) {
  if (!containerWidth || !containerHeight) {
    return null;
  }

  const left = detection.x * containerWidth;
  const top = detection.y * containerHeight;
  const width = detection.width * containerWidth;
  const height = detection.height * containerHeight;

  const borderColor = isConfirmed
    ? '#22c55e'
    : isActive
      ? '#3b82f6'
      : '#facc15';

  const borderWidth = isConfirmed || isActive ? 4 : 3;

  const progressSize = Math.min(width, height, 80);
  const progressStyle = {
    opacity: isActive ? 1 : 0,
    transform: [
      {
        scale: dwellProgress < 0.1 ? 0.3 : 0.3 + dwellProgress * 0.7,
      },
    ],
  };

  return (
    <View
      style={[
        styles.box,
        {
          left,
          top,
          width,
          height,
          borderColor,
          borderWidth,
        },
      ]}
      pointerEvents="none"
    >
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>{detection.label}</Text>
      </View>

      {isActive && (
        <Animated.View
          style={[
            styles.progressRing,
            {
              width: progressSize,
              height: progressSize,
              borderColor: '#3b82f6',
            },
            progressStyle,
          ]}
        />
      )}
    </View>
  );
}

export const BoundingBox = memo(BoundingBoxComponent);

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    borderRadius: 10,
  },
  labelContainer: {
    position: 'absolute',
    left: 0,
    top: -28,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  labelText: {
    color: '#f9fafb',
    fontSize: 14,
    fontWeight: '700',
  },
  progressRing: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
    marginTop: -40,
    borderRadius: 999,
    borderWidth: 3,
  },
});

