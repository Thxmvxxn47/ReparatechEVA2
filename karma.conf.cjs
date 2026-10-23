module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: ['src/tests/**/*.spec.js'],
    reporters: ['progress'],
    browsers: ['ChromeHeadless'],
    singleRun: true,
    plugins: ['karma-jasmine','karma-chrome-launcher']
  })
}
