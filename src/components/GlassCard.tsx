/**
 * Reusable glassmorphism card for MindLens UI.
 */

import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

type GlassCardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  glow?: boolean;
};

export function GlassCard({ children, style, glow }: GlassCardProps) {
  return (
    <View style={[styles.card, glow && styles.glow, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
  },
  glow: {
    borderColor: 'rgba(96, 165, 250, 0.35)',
    shadowColor: '#60a5fa',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
});
