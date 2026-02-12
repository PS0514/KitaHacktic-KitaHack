import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { GlassCard } from './GlassCard';

type Props = {
  detectedObject: string | null;
};

const STATIC_KEYWORDS = ['Help', 'Emergency', 'Pain', 'Water', 'Food'];

const OBJECT_KEYWORD_MAP: Record<string, string[]> = {
  cup: ['Water'],
  bottle: ['Water'],
  toilet: ['Toilet'],
};

// Color map for each keyword (matches your target UI)
const KEYWORD_COLORS: Record<string, string> = {
  Help: '#3b82f6',       // blue
  Emergency: '#ef4444',  // red
  Pain: '#f59e0b',       // orange
  Water: '#38bdf8',      // cyan
  Food: '#10b981',       // green
  Toilet: '#8b5cf6',     // purple
};

export function KeywordsPanel({ detectedObject }: Props) {
  const dynamicKeywords =
    detectedObject ? OBJECT_KEYWORD_MAP[detectedObject] ?? [] : [];

  return (
    <View style={styles.container}>
      <GlassCard style={styles.card}>
        <Text style={styles.title}>Communication Keywords</Text>
        <Text style={styles.subtitle}>Tap to speak instantly</Text>

        {/* Static keywords */}
        <Text style={styles.section}>Quick Needs</Text>
        <View style={styles.chips}>
          {STATIC_KEYWORDS.map(k => (
            <KeywordChip key={k} label={k} />
          ))}
        </View>

        {/* Dynamic keywords */}
        {dynamicKeywords.length > 0 && (
          <>
            <Text style={styles.section}>Suggested</Text>
            <View style={styles.chips}>
              {dynamicKeywords.map(k => (
                <KeywordChip key={k} label={k} highlight />
              ))}
            </View>
          </>
        )}
      </GlassCard>
    </View>
  );
}

function KeywordChip({
  label,
  highlight = false,
}: {
  label: string;
  highlight?: boolean;
}) {
  const color = KEYWORD_COLORS[label] ?? '#3b82f6';

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        {
          borderColor: color,
          backgroundColor: highlight ? color + '22' : 'transparent',
        },
      ]}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.chipText,
          {
            color: color,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },

  card: {
    flex: 1,
    padding: 18,
    justifyContent: 'center',
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
  },

  subtitle: {
    fontSize: 12,
    color: 'rgba(248,250,252,0.6)',
    marginBottom: 20,
  },

  section: {
    fontSize: 13,
    fontWeight: '600',
    color: '#c7d2fe',
    marginBottom: 10,
    marginTop: 12,
  },

  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  chipText: {
    fontWeight: '600',
    fontSize: 14,
  },
});
