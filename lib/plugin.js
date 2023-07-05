import { log } from './mixpanel.utils'

const _id = '<%= options.id %>'
const _windowStorageVariable = '<%= options.windowStorageVariable %>'

function mixpanelClient(ctx, initialized) {
  if (window[_windowStorageVariable] !== undefined) {
    window[_windowStorageVariable].forEach(event => {
      const { method, args } = event
      ctx.$mixpanel[method](...args)
    })
  }

  return {
    init(id = _id) {
      if (initialized[id] || !window._mixpanel_inject) {
        return
      }
      window._mixpanel_inject(id)
      initialized[id] = true

      window.mixpanel.init(id)

      log('init', id)
    },

    identify(id) {
      window.mixpanel.identify(id)

      log('identify', id)
    },

    reset() {
      window.mixpanel.reset()

      log('reset')
    },

    pageView(data = undefined) {
      window.mixpanel.track_pageview(data)

      log('page view', data)
    },

    peopleSet(data) {
      window.mixpanel.people.set(data)

      log('people set', data)
    },

    track(event, data = {}) {
      window.mixpanel.track(event, data)

      log('track', { event, data })
    }
  }
}

function mixpanelServer(ctx, initialized) {
  const events = []

  function pushEvent(event) {
    events.push(event)

    const mixpanelScript = ctx.app.head.script.find(s => s.hid == '<%= options.windowStorageVariable %>')
    mixpanelScript.innerHTML = `window['${ _windowStorageVariable }']=${ JSON.stringify(events) };`
  }

  return {
    init(id = _id) {
      if (initialized[id]) {
        return
      }

      initialized[id] = true

      log('init', id)
    },

    identify(id) {
      pushEvent({
        method: 'identify',
        args: [id]
      })

      log('identify', id)
    },

    reset() {
      pushEvent({
        method: 'reset',
        args: []
      })

      log('reset')
    },

    pageView(data = {}) {
      pushEvent({
        method: 'pageView',
        args: [data]
      })

      log('page view', JSON.stringify(data))
    },

    peopleSet(data) {
      pushEvent({
        method: 'peopleSet',
        args: [data]
      })

      log('people set', JSON.stringify(data))
    },

    track(event, data = {}) {
      pushEvent({
        method: 'track',
        args: [event, data]
      })

      log('track', JSON.stringify({
        event,
        data
      }))
    }
  }
}

function startPageTracking(ctx) {
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

export default function (ctx, inject) {
  const runtimeConfig = (ctx.$config && ctx.$config.mixpanel) || {}
  const autoInit = <%= options.autoInit %>
  const id = '<%= options.id %>'
  const runtimeId = runtimeConfig.id
  const initialized = autoInit && id ? {[id]: true} : {}
  const $mixpanel = process.client ? mixpanelClient(ctx, initialized) : mixpanelServer(ctx, initialized)
  if (autoInit && runtimeId && runtimeId !== id) {
    $mixpanel.init(runtimeId)
  }
  ctx.$mixpanel = $mixpanel
  inject('mixpanel', ctx.$mixpanel)
  <% if (options.pageTracking) { %>if (process.client) { startPageTracking(ctx); }<% } %>
}
