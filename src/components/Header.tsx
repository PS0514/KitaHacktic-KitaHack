import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';

export const HEADER_HEIGHT = 78;

export function Header() {

  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.8,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulse]);

  return (
    <View style={styles.container}>

      <View style={styles.inner}>

        {/* LEFT SIDE */}
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


        {/* RIGHT SIDE */}
        <View style={styles.statusPill}>

          <Animated.View
            style={[
              styles.pulse,
              {
                transform: [{ scale: pulse }],
                opacity: pulse.interpolate({
                  inputRange: [1, 1.8],
                  outputRange: [0.7, 0],
                }),
              },
            ]}
          />

          <View style={styles.statusDot} />

          <Text style={styles.statusText}>
            System Active
          </Text>

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
  },

  inner: {

    height: HEADER_HEIGHT,

    paddingHorizontal: 18,

    backgroundColor: '#2b3f8f', // KEY FIX — blue header like reference

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

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
  },

  logoCircle: {

    width: 40,
    height: 40,

    borderRadius: 10,

    backgroundColor: '#3b82f6',

    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#60a5fa',
    shadowOpacity: 0.7,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },

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

  statusPill: {

    paddingHorizontal: 14,
    paddingVertical: 7,

    borderRadius: 999,

    backgroundColor: 'rgba(255,255,255,0.12)',

    flexDirection: 'row',
    alignItems: 'center',

    overflow: 'hidden',
  },

  statusDot: {

    width: 8,
    height: 8,

    borderRadius: 4,

    backgroundColor: '#22c55e',

    marginRight: 8,

  },

  statusText: {

    color: '#ffffff',

    fontSize: 13,

    fontWeight: '600',

  },

  pulse: {

    position: 'absolute',

    width: 24,
    height: 24,

    borderRadius: 12,

    backgroundColor: 'rgba(34,197,94,0.35)',

    left: 6,

  },

});
