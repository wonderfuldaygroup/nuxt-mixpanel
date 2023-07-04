// This is a mock version because gtm module is disabled
// You can explicitly enable module using `mixpanel.enabled: true` in nuxt.config
import { log } from './mixpanel.utils'

const _id = '<%= options.id %>'

function startPageTracking (ctx) {
  ctx.app.router.afterEach((to) => {
    setTimeout(() => {
      ctx.$mixpanel.push(to.mixpanel || {
        routeName: to.name,
        pageType: 'PageView',
        pageUrl: '<%= options.routerBase %>' + to.fullPath,
        pageTitle: (typeof document !== 'undefined' && document.title) || '',
        event: '<%= options.pageViewEventName %>'
      })
    }, 250)
  })
}

export default function (ctx, inject) {
  log('Using mocked API. Real GTM events will not be reported.')
  const mixpanel = {
    init: (id) => {
      log('init', id)
    },

    identity: (id) => {
      log('identity', id)
    },

    pageView: (data = {}) => {
      log('track', process.client ? { data } : JSON.stringify({ data }))
    },

    track: (event, data = {}) => {
      log('track', process.client ? { event, data } : JSON.stringify({ event, data }))
    }
  }

  ctx.$mixpanel = mixpanel
  inject('mixpanel', mixpanel)
  <% if (options.pageTracking) { %>if (process.client) { startPageTracking(ctx); }<% } %>
}
