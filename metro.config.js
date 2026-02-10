const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = getDefaultConfig(__dirname);

// Add 'tflite' to the list of asset extensions
config.resolver.assetExts.push('tflite');

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
