import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';

// Increased height slightly to accommodate the padding
export const HEADER_HEIGHT = 90;

export function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.inner}>

        {/* LEFT SIDE: Brand Identity */}
        <View style={styles.left}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>
              ML
            </Text>
          </View>

          <View>
            <Text style={styles.title}>
              MindLens
            </Text>
            <Text style={styles.subtitle}>
              AI-Powered Assistive Communication
            </Text>
          </View>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    // Fix for the battery/status bar blocking the content
    backgroundColor: '#2b3f8f',
  },
  inner: {
    height: HEADER_HEIGHT,
    paddingHorizontal: 18,
    // Adds spacing at the top specifically for the status bar
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 30,
    backgroundColor: '#2b3f8f',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: -10,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    marginTop: 1,
    fontWeight: '500',
  },
});