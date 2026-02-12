import React from 'react';
import { View, StyleSheet } from 'react-native';

export function Reticle({ progress }: { progress: number }) {

  return (
    <View style={styles.container}>

      <View style={styles.crosshairHorizontal} />
      <View style={styles.crosshairVertical} />

      <View
        style={[
          styles.circle,
          {
            borderColor: '#3b82f6',
            transform: [
              { scale: 1 + progress * 0.3 },
            ],
          },
        ]}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
    marginTop: -40,
  },

  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
  },

  crosshairHorizontal: {
    position: 'absolute',
    width: 120,
    height: 1,
    backgroundColor: '#3b82f6',
    top: 40,
    left: -20,
  },

  crosshairVertical: {
    position: 'absolute',
    width: 1,
    height: 120,
    backgroundColor: '#3b82f6',
    left: 40,
    top: -20,
  },

});
