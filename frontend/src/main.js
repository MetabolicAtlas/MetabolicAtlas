import { createApp } from 'vue';
import { createHead } from '@vueuse/head';
import VueMatomo from 'vue-matomo';
import axios from 'axios';
import vueDebounce from 'vue-debounce';
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

const head = createHead();
app.use(head);

app.use(router);

app.use(vueDebounce, {
  listenTo: 'input',
});

if (navigator.doNotTrack !== '1') {
  app.use(VueMatomo, {
    host: 'https://csbi.chalmers.se/',
    siteId: import.meta.env.VITE_VUE_APP_MATOMOID,
    router,
  });
}

app.mixin(linkHandlerMixin);

app.mount('#app');
