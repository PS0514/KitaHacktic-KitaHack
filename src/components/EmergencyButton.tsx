import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

type Props = {
  label: 'HELP' | 'EMERGENCY' | 'PAIN' | 'WATER' | 'FOOD';
  onPressFallback?: () => void;
  isActive?: boolean;
};

/**
 * Professional Medical Color System
 */
function getGradient(label: string): string[] {

  switch (label) {

    case 'EMERGENCY':
      return ['#ef4444', '#7f1d1d']; // crimson

    case 'HELP':
      return ['#3b82f6', '#1e3a8a']; // medical blue

    case 'PAIN':
      return ['#f59e0b', '#78350f']; // amber

    case 'WATER':
      return ['#0ea5e9', '#0c4a6e']; // cyan blue

    case 'FOOD':
      return ['#10b981', '#064e3b']; // emerald green

    default:
      return ['#334155', '#0f172a'];

  }
}

/**
 * Glow color based on urgency
 */
function getGlow(label: string): string {

  switch (label) {

    case 'EMERGENCY':
      return '#ef4444';

    case 'HELP':
      return '#3b82f6';

    case 'PAIN':
      return '#f59e0b';

    case 'WATER':
      return '#0ea5e9';

    case 'FOOD':
      return '#10b981';

    default:
      return '#3b82f6';

  }
}

export function EmergencyButton({
  label,
  onPressFallback,
  isActive = false,
}: Props) {

  const colors = getGradient(label);
  const glowColor = getGlow(label);

  return (

    <TouchableOpacity
      onPress={onPressFallback}
      activeOpacity={0.85}
    >

      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.button,
          isActive && {
            shadowColor: glowColor,
            shadowOpacity: 0.9,
            elevation: 14,
          } as ViewStyle,
        ]}
      >

        <Text style={styles.text}>
          {label}
        </Text>

      </LinearGradient>

    </TouchableOpacity>

  );
}

const styles = StyleSheet.create({

  button: {

    minWidth: 110,

    paddingHorizontal: 22,
    paddingVertical: 14,

    borderRadius: 40,

    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },

    elevation: 8,
  },

  text: {

    color: '#ffffff',

    fontSize: 14,
    fontWeight: '700',

    letterSpacing: 1,

  },

});
