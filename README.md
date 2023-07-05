# @wonderfulday/nuxt-mixpanel

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]

> Mixpanel Module for Nuxt.js

[📖 **Release Notes**](./CHANGELOG.md)

## Setup

1. Add `@wonderfulday/nuxt-mixpanel` dependency to your project

```bash
yarn add @wonderfulday/nuxt-mixpanel # or npm install @wonderfulday/nuxt-mixpanel
```

2. Add `@wonderfulday/nuxt-mixpanel` to the `modules` section of `nuxt.config.js`

```js
export default {
  modules: [
    '@wonderfulday/nuxt-mixpanel',
  ],
  mixpanel: {
    id: '',
    config: {
      debug: true
    }
  }
}
```
### Runtime Config

You can use [runtime config](https://nuxtjs.org/guide/runtime-config) if need to use dynamic environment variables in production. Otherwise, the options will be hardcoded during the build and won't be read from `nuxt.config` anymore.

```js
export default {
  modules: [
    '@wonderfulday/nuxt-mixpanel'
  ],

  mixpanel: {
    id: '', // Used as fallback if no runtime config is provided
  },

  publicRuntimeConfig: {
    mixpanel: {
      id: process.env.MIXPANEL_ID,
    }
  }
}
```

## Options

Defaults:

```js
export default {
  mixpanel: {
    debug: false,

    enabled: true,

    id: undefined,
    windowStorageVariable: 'mixpanelStorage',

    pageTracking: false,
    pageViewEventName: 'nuxtRoute',

    autoInit: true,
    respectDoNotTrack: true,

    scriptId: 'nuxtMixpanel',
    scriptURL: 'cdn.mxpnl.com/libs/mixpanel-2-latest.min.js',
  }
}
```

### `enabled`

Mixpanel module uses a debug-only version of `$mixpanel` during development (`nuxt dev`).

You can explicitly enable or disable it using `enabled` option:

```js
export default {
  mixpanel: {
    // Always send real Mixpanel events (also when using `nuxt dev`)
    enabled: true
  }
}
```

### `debug`

Whether `$mixpanel` API calls like `track` are logged to the console.

### Manual Mixpanel Initialization

There are several use cases that you may need more control over initialization:

- Block Mixpanel before user directly allows (GDPR realisation or other)
- Dynamic ID based on request path or domain
- Initialize with multi containers
- Enable Mixpanel on page level

`nuxt.config.js`:

```js
export default {
 modules: [
  '@wonderfulday/nuxt-mixpanel'
 ],
 plugins: [
  '~/plugins/mixpanel'
 ]
}
```

`plugins/mixpanel.js`:

```js
export default function({ $mixpanel, route }) {
    $mixpanel.init('TOKEN')
}
```

- **Note:** All events will be still buffered in data layer but won't send until `init()` method getting called.

### Router Integration

You can optionally set `pageTracking` option to `true` to track page views.

The default event name for page views is `nuxtRoute`, you can change it by setting the `pageViewEventName` option.

## Usage

### Pushing events

You can push events into the configured layer:

```js
this.$mixpanel.track('event name', {
    distinct_id: 'unique client id',
    property_1: 'value 1',
    property_2: 'value 1',
    property_3: 'value 1'
})
```

## Development

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Start development server using `yarn dev` or `MIXPANEL_ID=<your mixpanel token> yarn dev` if you want to provide custom MIXPANEL_TOKEN.

## Contributors

- Inspired by [nuxt-community/gtm-module](https://github.com/nuxt-community/gtm-module)
- [Nikolaj Løvenhardt](https://github.com/nikolajlovenhardt)

## License

[MIT License](./LICENSE)

Copyright (c) Wonderfulday

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@wonderfulday/nuxt-mixpanel/latest.svg?style=flat-square
[npm-version-href]: https://npmjs.com/package/@wonderfulday/nuxt-mixpanel

[npm-downloads-src]: https://img.shields.io/npm/dt/@wonderfulday/nuxt-mixpanel.svg?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/@wonderfulday/nuxt-mixpanel

[license-src]: https://img.shields.io/npm/l/@wonderfulday/nuxt-mixpanel.svg?style=flat-square
[license-href]: https://npmjs.com/package/@wonderfulday/nuxt-mixpanel
