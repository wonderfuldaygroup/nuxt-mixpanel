const { resolve } = require('path')

module.exports = {
  rootDir: resolve(__dirname, '..'),
  buildDir: resolve(__dirname, '.nuxt'),
  head: {
    title: '@wonderfulday/nuxt-mixpanel'
  },
  srcDir: __dirname,
  render: {
    resourceHints: false
  },
  modules: [
    { handler: require('../') }
  ],
  plugins: [
    '~/plugins/mixpanel'
  ],
  mixpanel: {
    id: process.env.MIXPANEL_ID || '',
    pageTracking: true
  },
  publicRuntimeConfig: {
    mixpanel: {
      id: 'TOKEN'
    }
  }
}
