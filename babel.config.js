module.exports = {
  presets: ['module:@react-native/babel-preset'],

  plugins: [

    // MUST be FIRST
    ['react-native-worklets-core/plugin'],

    // dotenv AFTER worklets
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
      },
    ],

  ],
};