import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import ObjectDetector from './computer_vision/ObjectDetector'; // We will create this file next

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <ObjectDetector />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});

export default App;