module.exports = function (api) {
  api.cache(true);
  return {
    // `nativewind/babel` exports a preset-style config (it returns an object
    // with a `plugins` array). Using it as a plugin causes Babel to see a
    // nested `plugins` property on a plugin result which is invalid. Move it
    // into `presets` so its inner plugins are merged correctly.
    presets: ['babel-preset-expo', 'nativewind/babel'],
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
      }]
    ],
  };
};
