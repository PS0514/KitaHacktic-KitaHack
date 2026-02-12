import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';

export function Header() {

  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.8,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

  }, []);

  return (
    <View style={styles.container}>

      {/* Frosted Glass */}
      <View style={styles.glass}>

        {/* Center Title */}
        <Text style={styles.title}>MindLens</Text>

        {/* Pulse indicator */}
        <View style={styles.statusContainer}>

          <Animated.View
            style={[
              styles.pulse,
              {
                transform: [{ scale: pulse }],
                opacity: pulse.interpolate({
                  inputRange: [1, 1.8],
                  outputRange: [0.6, 0],
                }),
              },
            ]}
          />

          <View style={styles.dot} />

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
    alignItems: 'center',
  },

  glass: {
    marginTop: 10,
    width: '90%',
    paddingVertical: 14,

    backgroundColor: 'rgba(15,23,42,0.55)',

    borderRadius: 20,

    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.15)',

    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },

  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  statusContainer: {
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dot: {
    width: 6,
    height: 6,
    backgroundColor: '#22c55e',
    borderRadius: 3,
  },

  pulse: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#22c55e',
  },

});
