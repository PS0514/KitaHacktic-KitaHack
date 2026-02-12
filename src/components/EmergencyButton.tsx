import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

type Props = {
  label: 'HELP' | 'EMERGENCY' | 'PAIN' | 'WATER' | 'FOOD';
  onPressFallback?: () => void;
  isActive?: boolean;
  isScanning?: boolean;
  isConfirmed?: boolean;
};

function getColor(label: string): string {
  switch (label) {
    case 'HELP': return '#3b82f6'; // Blue
    case 'EMERGENCY': return '#ef4444'; // Red
    case 'PAIN': return '#f59e0b'; // Orange
    case 'WATER': return '#06b6d4'; // Cyan
    case 'FOOD': return '#10b981'; // Green
    default: return '#3b82f6';
  }
}

function getIcon(label: string): string {
  switch (label) {
    case 'HELP': return 'life-buoy';
    case 'EMERGENCY': return 'alert-triangle';
    case 'PAIN': return 'activity';
    case 'WATER': return 'droplet';
    case 'FOOD': return 'coffee';
    default: return 'circle';
  }
}

export function EmergencyButton({
  label,
  onPressFallback,
  isActive = false,
  isScanning = false,
  isConfirmed = false,
}: Props) {

  const baseColor = getColor(label);
  const iconName = getIcon(label);

  // --- HIGH CONTRAST LOGIC ---
  // If scanning, we override EVERYTHING to be Yellow/Black
  const isHighContrast = isScanning || isActive;

  const activeBackgroundColor = isHighContrast ? '#FFD700' : 'transparent'; // Bright Gold
  const activeBorderColor = isHighContrast ? '#FFFFFF' : baseColor; // White border pops against dark bg
  const iconColor = isHighContrast ? '#000000' : baseColor; // Black icon
  const textColor = isHighContrast ? '#000000' : baseColor; // Black text

  return (
    <TouchableOpacity
      onPress={onPressFallback}
      activeOpacity={0.85}
      style={[
        styles.container,
        isScanning && styles.containerScanning // Scale up animation
      ]}
    >
      <View
        style={[
          styles.button,
          {
            borderColor: activeBorderColor,
            backgroundColor: activeBackgroundColor,
          },
          // Add a strong shadow/glow when active
          isHighContrast && {
            shadowColor: '#FFD700',
            shadowOpacity: 1,
            shadowRadius: 15,
            elevation: 20,
            borderWidth: 4, // Thicker border for visibility
          } as ViewStyle,
        ]}
      >
        <Icon
          name={iconName}
          size={isHighContrast ? 28 : 24} // Make icon bigger when active
          color={iconColor}
          style={styles.icon}
        />

        <Text style={[
          styles.text,
          { color: textColor },
          isHighContrast && styles.textHighContrast // Make text bolder
        ]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 6, // Add spacing between buttons
  },

  containerScanning: {
    transform: [{ scale: 1.1 }], // Pop out effect
    zIndex: 999, // Ensure it sits on top of everything
  },

  button: {
    height: 72,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    marginBottom: 4,
  },

  text: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  textHighContrast: {
    fontSize: 16,
    fontWeight: '900', // Extra bold for readability
    textTransform: 'uppercase',
  },
});