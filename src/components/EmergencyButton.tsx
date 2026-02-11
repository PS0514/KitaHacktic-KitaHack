import React, { memo } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  label: string;
  isActive: boolean;
  isConfirmed: boolean;
  dwellProgress: number;
  onPressFallback?: () => void;
};

function EmergencyButtonComponent({
  label,
  isActive,
  isConfirmed,
  dwellProgress,
  onPressFallback,
}: Props) {
  const defaultColor =
    label === 'HELP' || label === 'PAIN'
      ? '#ef4444'
      : '#f97316';

  const borderColor = isConfirmed
    ? '#22c55e'
    : isActive
    ? '#3b82f6'
    : defaultColor;

  const progressStyle = {
    opacity: isActive ? 1 : 0,
    transform: [
      {
        scale: 0.6 + dwellProgress * 0.4,
      },
    ],
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPressFallback}>
      <View style={[styles.button, { borderColor }]}>
        <Text style={styles.text}>{label}</Text>

        {isActive && (
          <Animated.View
            style={[
              styles.progressRing,
              progressStyle,
              { borderColor: '#3b82f6' },
            ]}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

export const EmergencyButton = memo(EmergencyButtonComponent);

const styles = StyleSheet.create({
  button: {
    minWidth: 120,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 3,
    backgroundColor: 'rgba(15,23,42,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  progressRing: {
    position: 'absolute',
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderRadius: 40,
    borderWidth: 3,
  },
});
