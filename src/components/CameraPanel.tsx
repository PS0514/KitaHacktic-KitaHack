import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { GlassCard } from './GlassCard';

type Props = {
  onDetect: (object: string | null) => void;
};

export function CameraPanel({ onDetect }: Props) {
  const mockScan = () => {
    // DEMO: pretend camera sees a cup
    onDetect('cup');
  };

  return (
    <View style={styles.container}>
      <GlassCard style={styles.card} glow>
        <View style={styles.preview}>
          <Text style={styles.previewText}>Camera preview</Text>

          <View style={styles.status}>
            <Text style={styles.statusText}>Ready</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.scanBtn} onPress={mockScan}>
            <Text style={styles.scanText}>Start Scanning</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.speakBtn}>
            <Text style={styles.speakText}>🔊 Speak</Text>
          </TouchableOpacity>
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  card: {
    flex: 1,
    padding: 16,
  },
  preview: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  previewText: {
    color: 'rgba(248,250,252,0.35)',
  },
  status: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(34,197,94,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#86efac',
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
  },
  scanBtn: {
    flex: 1,
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  scanText: {
    color: '#fff',
    fontWeight: '700',
  },
  speakBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 18,
    borderRadius: 14,
    justifyContent: 'center',
  },
  speakText: {
    color: '#e5e7eb',
    fontWeight: '600',
  },
});
