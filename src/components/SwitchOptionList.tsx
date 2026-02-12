import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  items: string[];
  activeIndex: number;
}

export default function SwitchOptionList({
  items,
  activeIndex,
}: Props) {
  return (
    <View style={styles.container}>
      {items.map((item, i) => {
        const isActive = i === activeIndex;

        return (
          <View
            key={i}
            style={[
              styles.box,
              isActive ? styles.activeBox : styles.inactiveBox,
            ]}
          >
            <Text style={[
              styles.text,
              isActive ? styles.activeText : styles.inactiveText
            ]}>
              {item}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
  },
  box: {
    padding: 24, // Larger touch target
    borderRadius: 16,
    marginVertical: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- INACTIVE STATE (Dark Theme) ---
  inactiveBox: {
    borderColor: '#334155', // Dark Grey
    backgroundColor: '#0f172a', // Dark Blue/Black
  },
  inactiveText: {
    color: '#94a3b8', // Light Grey text
    fontSize: 18,
    fontWeight: '500',
  },

  // --- ACTIVE STATE (High Contrast Accessibility) ---
  activeBox: {
    borderColor: '#FFFFFF', // White border to separate from dark background
    backgroundColor: '#FFD700', // Bright Yellow
    borderWidth: 4,         // Thick border
    transform: [{ scale: 1.05 }], // Pop out effect

    // Strong Shadow for visibility
    shadowColor: '#FFD700',
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },
  activeText: {
    color: '#000000', // Black text on Yellow = Best Contrast
    fontSize: 22,     // Larger text for the active item
    fontWeight: '900', // Extra Bold
  },
  text: {
    textAlign: 'center',
  },
});