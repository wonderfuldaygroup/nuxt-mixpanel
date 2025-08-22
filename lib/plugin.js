import { log } from './mixpanel.utils'

const _id = '<%= options.id %>'
const _windowStorageVariable = '<%= options.windowStorageVariable %>'

function mixpanelClient(ctx, initialized) {
  if (window[_windowStorageVariable] !== undefined) {
    setTimeout(() => {
      window[_windowStorageVariable].forEach(event => {
        const { method, args } = event
        ctx.$mixpanel[method](...args)
      })
    }, 250)
  }

  return {
    init(id = _id) {
      if (initialized[id] || !window._mixpanel_inject) {
        return
      }

      try {
        window._mixpanel_inject(id)
        initialized[id] = true

        window.mixpanel.init(id)
      } catch (exception) {
      }

      log('init', id)
    },

    identify(id) {
      try {
        window.mixpanel.identify(id)
      } catch (exception) {
      }

      log('identify', id)
    },

    reset() {
      try {
        window.mixpanel.reset()
      } catch (exception) {
      }

      log('reset')
    },

    pageView(data = undefined) {
      try {
        window.mixpanel.track_pageview(data)
      } catch (exception) {
      }

      log('page view', data)
    },

    peopleSet(data) {
      try {
        window.mixpanel.people.set(data)
      } catch (exception) {
      }

      log('people set', data)
    },

    track(event, data = {}) {
      try {
        window.mixpanel.track(event, data)
      } catch (exception) {
      }

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
  const track_pageview = <%= options.track_pageview %>
  const runtimeId = runtimeConfig.id
  const initialized = autoInit && id ? {[id]: true} : {}
  const $mixpanel = process.client ? mixpanelClient(ctx, initialized) : mixpanelServer(ctx, initialized)
  if (autoInit && runtimeId && runtimeId !== id) {
    $mixpanel.init(runtimeId, {
      persistence: 'localStorage',
      track_pageview: track_pageview
    })
  }
  ctx.$mixpanel = $mixpanel
  inject('mixpanel', ctx.$mixpanel)
  <% if (options.pageTracking) { %>if (process.client) { startPageTracking(ctx); }<% } %>
}
