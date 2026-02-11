/**
 * MindLens top bar: logo, app name, subtitle, status pill.
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GlassCard } from './GlassCard';

export function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <View style={styles.logoWrapper}>
          <Text style={styles.logoText} accessibilityLabel="MindLens logo">
            M
          </Text>
        </View>
        <View style={styles.titleBlock}>
          <Text style={styles.appName} accessibilityRole="header">
            MindLens
          </Text>
          <Text style={styles.subtitle}>
            AI-Powered Assistive Communication
          </Text>
        </View>
      </View>
      <GlassCard style={styles.pill} glow>
        <Text style={styles.pillText}>System Active</Text>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(96, 165, 250, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#93c5fd',
  },
  titleBlock: {
    flex: 1,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f8fafc',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(248, 250, 252, 0.75)',
    marginTop: 2,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#86efac',
  },
});
