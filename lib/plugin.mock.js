// This is a mock version because mixpanel module is disabled
// You can explicitly enable module using `mixpanel.enabled: true` in nuxt.config
import { log } from './mixpanel.utils'

const _id = '<%= options.id %>'

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

export default function (ctx, inject) {
  log('Using mocked API. Real Mixpanel events will not be reported.')
  const mixpanel = {
    init: (id) => {
      log('init', id)
    },

    identify: (id) => {
      log('identify', id)
    },

    reset: () => {
      log('reset')
    },

    pageView: (data = {}) => {
      log('page view', process.client ? { data } : JSON.stringify({ data }))
    },

    peopleSet: (data) => {
      log('people set', process.client ? data : JSON.stringify(data))
    },

    track: (event, data = {}) => {
      log('track', process.client ? { event, data } : JSON.stringify({ event, data }))
    }
  }

  ctx.$mixpanel = mixpanel
  inject('mixpanel', mixpanel)
  <% if (options.pageTracking) { %>if (process.client) { startPageTracking(ctx); }<% } %>
}
