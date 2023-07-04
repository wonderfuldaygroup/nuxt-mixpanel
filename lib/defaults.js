const defaults = {
  debug: false,

  enabled: true,

  id: undefined,
  layer: 'dataLayer',
  variables: {},

  pageTracking: false,
  pageViewEventName: 'nuxtRoute',

  autoInit: true,
  respectDoNotTrack: true,

  scriptURL: 'cdn.mxpnl.com/libs/mixpanel-2-latest.min.js',
}

module.exports = defaults
