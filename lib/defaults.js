const defaults = {
  debug: false,

  enabled: true,

  id: undefined,
  windowStorageVariable: 'nuxtMixpanelStorage',

  pageTracking: false,
  pageViewEventName: 'nuxtRoute',

  autoInit: true,
  respectDoNotTrack: true,

  scriptId: 'nuxtMixpanel',
  scriptURL: 'cdn.mxpnl.com/libs/mixpanel-2-latest.min.js',
}

module.exports = defaults
