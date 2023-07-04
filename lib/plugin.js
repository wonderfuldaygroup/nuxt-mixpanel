import { log } from './mixpanel.utils'

const _id = '<%= options.id %>'

function mixpanelClient(ctx, initialized) {
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

    pageView(data = undefined) {
      window.mixpanel.track_pageview(data)

      log('page view', data)
    },

    track(event, data = {}) {
      window.mixpanel.track(event, data)

      log('track', { event, data })
    }
  }
}

function mixpanelServer(ctx, initialized) {
  return {
    init(id = _id) {
      if (initialized[id]) {
        return
      }

      initialized[id] = true

      log('init', id)
    },

    identify(id) {
      log('identify', id)
    },

    track(event, data = {}) {
      log('tracking', JSON.stringify({
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
