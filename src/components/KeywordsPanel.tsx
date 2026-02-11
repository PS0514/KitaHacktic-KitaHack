import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { GlassCard } from './GlassCard';

type Props = {
  detectedObject: string | null;
};

const STATIC_KEYWORDS = ['Help', 'Pain', 'Toilet', 'Water'];

const OBJECT_KEYWORD_MAP: Record<string, string[]> = {
  cup: ['Water'],
  bottle: ['Water'],
  toilet: ['Toilet'],
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
  return (
    <TouchableOpacity
      style={[styles.chip, highlight && styles.chipHighlight]}
    >
      <Text
        style={[styles.chipText, highlight && styles.chipTextHighlight]}
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
    gap: 10,
  },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  chipHighlight: {
    backgroundColor: 'rgba(96,165,250,0.25)',
    borderColor: 'rgba(96,165,250,0.6)',
  },
  chipText: {
    color: '#e5e7eb',
    fontWeight: '600',
    fontSize: 13,
  },
  chipTextHighlight: {
    color: '#e0f2fe',
  },
});
