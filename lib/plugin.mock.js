// This is a mock version because mixpanel module is disabled
// You can explicitly enable module using `mixpanel.enabled: true` in nuxt.config
import { log } from './mixpanel.utils'

const _id = '<%= options.id %>'
const _windowStorageVariable = '<%= options.windowStorageVariable %>'

function startPageTracking (ctx) {
  ctx.app.router.afterEach((to) => {
    setTimeout(() => {
      ctx.$mixpanel.pageView(to.mixpanel || {
        routeName: to.name,
        pageType: 'PageView',
        pageUrl: '<%= options.routerBase %>' + to.fullPath,
        page: (typeof document !== 'undefined' && document.title) || '',
        event: '<%= options.pageViewEventName %>'
      })
    }, 250)
  })
}

function mixpanelClient(ctx) {
  setTimeout(() => {
    if (window[_windowStorageVariable] !== undefined) {
      window[_windowStorageVariable].forEach(event => {
        const { method, args } = event
        ctx.$mixpanel[method](...args)
      })
    }
  }, 250)

  return {
    init(id = _id) {
      log('init', id)
    },

    identify(id) {
      log('identify', id)
    },

    reset() {
      log('reset')
    },

    pageView(data = {}) {
      log('page view', JSON.stringify(data))
    },

    peopleSet(data) {
      log('people set', JSON.stringify(data))
    },

    track(event, data = {}) {
      log('track', JSON.stringify({
        event,
        data
      }))
    }
  }
}

function mixpanelServer(ctx) {
  const events = []

  function pushEvent(event) {
    events.push(event)

    const mixpanelScript = ctx.app.head.script.find(s => s.hid == '<%= options.windowStorageVariable %>')
    mixpanelScript.innerHTML = `window['${ _windowStorageVariable }']=${ JSON.stringify(events) };`
  }

  return {
    init(id = _id) {
      log('[server] init', id)
    },

    identify(id) {
      pushEvent({
        method: 'identify',
        args: [id]
      })

      log('[server] identify', id)
    },

    reset() {
      pushEvent({
        method: 'reset',
        args: []
      })

      log('[server] reset')
    },

    pageView(data = {}) {
      pushEvent({
        method: 'pageView',
        args: [data]
      })

      log('[server] page view', JSON.stringify(data))
    },

    peopleSet(data) {
      pushEvent({
        method: 'peopleSet',
        args: [data]
      })

      log('[server] people set', JSON.stringify(data))
    },

    track(event, data = {}) {
      pushEvent({
        method: 'track',
        args: [event, data]
      })

      log('[server] track', JSON.stringify({
        event,
        data
      }))
    }
  }
}

export default function (ctx, inject) {
  log('Using mocked API. Real Mixpanel events will not be reported.')

  const $mixpanel = process.client ? mixpanelClient(ctx) : mixpanelServer(ctx)

  ctx.$mixpanel = $mixpanel
  inject('mixpanel', $mixpanel)
  <% if (options.pageTracking) { %>if (process.client) { startPageTracking(ctx); }<% } %>
}
