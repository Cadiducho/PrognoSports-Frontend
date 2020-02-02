import Vue from 'vue'
import App from '@/App.vue'
import { router } from '@/router'
import store from '@/_store';

// @ts-ignore
import VueHeadful from 'vue-headful';
import Loading from '@/components/lib/Loading.vue'

import './scss/app.scss';

const moment = require('moment');
require('moment/locale/es');

Vue.use(require('vue-moment-tz'), {
  moment
});

import './js/sidebar';
import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);

Vue.config.productionTip = false;

Vue.component('vue-headful', VueHeadful);
Vue.component("Loading", Loading);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
