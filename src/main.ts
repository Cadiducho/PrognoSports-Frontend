import Vue from 'vue'
import Buefy from 'buefy';
import App from '@/App.vue'
import { router } from '@/router'
import store from '@/_store';

// @ts-ignore
import VueHeadful from 'vue-headful';
import Loading from '@/components/lib/Loading.vue'

import './scss/app.scss';
import { loadFilters } from "@/plugins/dayjs";
import { loadLeaflet } from "@/plugins/leaflet";
loadFilters(Vue);
loadLeaflet();

Vue.use(Buefy);
Vue.config.productionTip = false;

Vue.component('vue-headful', VueHeadful);
Vue.component("Loading", Loading);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
