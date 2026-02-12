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
  isConfirmed?: boolean;
};

/**
 * Color system
 */
function getColor(label: string): string {
  switch (label) {
    case 'HELP':
      return '#3b82f6';
    case 'EMERGENCY':
      return '#ef4444';
    case 'PAIN':
      return '#f59e0b';
    case 'WATER':
      return '#06b6d4';
    case 'FOOD':
      return '#10b981';
    default:
      return '#3b82f6';
  }
}

/**
 * Icon mapping
 */
function getIcon(label: string): string {
  switch (label) {
    case 'HELP':
      return 'life-buoy';
    case 'EMERGENCY':
      return 'alert-triangle';
    case 'PAIN':
      return 'activity';
    case 'WATER':
      return 'droplet';
    case 'FOOD':
      return 'coffee';
    default:
      return 'circle';
  }
}

export function EmergencyButton({
  label,
  onPressFallback,
  isActive = false,
  isConfirmed = false,
}: Props) {

  const color = getColor(label);
  const icon = getIcon(label);
  const glow = isActive || isConfirmed;

  return (
    <TouchableOpacity
      onPress={onPressFallback}
      activeOpacity={0.85}
      style={styles.container}
    >
      <View
        style={[
          styles.button,

          {
            borderColor: color,
          },

          glow && {
            shadowColor: color,
            shadowOpacity: 0.9,
            shadowRadius: 18,
            elevation: 16,
            backgroundColor: color + '15',
          } as ViewStyle,
        ]}
      >
        <Icon
          name={icon}
          size={22}
          color={color}
          style={styles.icon}
        />

        <Text style={[styles.text, { color }]}>
          {label}
        </Text>

      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  button: {

    height: 72,

    borderRadius: 14,

    borderWidth: 1.5,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'transparent',

    marginHorizontal: 6,

  },

  icon: {
    marginBottom: 6,
  },

  text: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

});
