const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // Keeps your existing browser/node resolution fixes
    unstable_conditionNames: ['browser', 'require', 'react-native'],

    // Adds 'tflite' to the list of assets Metro can bundle
    assetExts: [...assetExts, 'tflite'],
    sourceExts: [...sourceExts],
  },
};

module.exports = mergeConfig(defaultConfig, config);