import Vue from 'vue'
import VueMatomo from 'vue-matomo'
import VueMeta from 'vue-meta'
import axios from 'axios'
import vueDebounce from 'vue-debounce'
import NProgress from 'nprogress'
import App from '@/App'
import router from '@/router'
import store from './store'
import linkHandlerMixin from './mixins/linkHandler'

axios.defaults.baseURL = '/api/v2'
axios.defaults.onDownloadProgress = function onDownloadProgress(progressEvent) {
  const percentCompleted = Math.floor((progressEvent.loaded * 100.0) / progressEvent.total)
  NProgress.set(percentCompleted / 100.0)
}

Vue.use(vueDebounce)

if (navigator.doNotTrack !== '1') {
  Vue.use(VueMatomo, {
    host: 'https://csbi.chalmers.se/',
    siteId: process.env.VUE_APP_MATOMOID,
    router,
  })
}

Vue.mixin(linkHandlerMixin)

Vue.use(VueMeta)

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
})
