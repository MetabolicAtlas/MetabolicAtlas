module.exports = {
  viewportWidth: 1200,
  viewportHeight: 800,
  video: false,

  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      // eslint-disable-next-line global-require
      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: 'http://localhost',
  },

  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
};
