import { createApp } from 'vue';
import { createHead } from '@vueuse/head';
import VueMatomo from 'vue-matomo';
import VueCookies from 'vue-cookies';
import axios from 'axios';
import { vue3Debounce } from 'vue-debounce';
import NProgress from 'nprogress';
import App from '@/App.vue';
import router from '@/router';
import store from './store';
import linkHandlerMixin from './mixins/linkHandler';

axios.defaults.baseURL = '/api/v2';
axios.defaults.onDownloadProgress = function onDownloadProgress(progressEvent) {
  const percentCompleted = Math.floor((progressEvent.loaded * 100.0) / progressEvent.total);
  NProgress.set(percentCompleted / 100.0);
};

const app = createApp(App);
app.use(store);
app.use(VueCookies);

const head = createHead();
app.use(head);

app.use(router);

app.directive('debounce', vue3Debounce({ lock: true }));

if (navigator.doNotTrack !== '1') {
  app.use(VueMatomo, {
    host: 'https://csbi.chalmers.se/',
    siteId: import.meta.env.VITE_VUE_APP_MATOMOID,
    router,
  });
}

app.mixin(linkHandlerMixin);

app.mount('#app');
