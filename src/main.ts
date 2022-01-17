import Vue from 'vue'
import Buefy from 'buefy';
import App from '@/App.vue'
import router from '@/_router'
import store from '@/_store';

// @ts-ignore
import VueHeadful from 'vue-headful';
import VueClipboard from 'vue-clipboard2'
import Loading from '@/components/lib/Loading.vue'

import './scss/app.scss';
import { loadFilters } from "@/plugins/dayjs";
import { loadLeaflet } from "@/plugins/leaflet";
import mixin from "@/plugins/mixin";

loadFilters(Vue);
loadLeaflet();

Vue.use(Buefy, {
    defaultIconPack: 'fa'
});
Vue.use(VueClipboard);
Vue.config.productionTip = false;

Vue.component("Loading", Loading);
Vue.mixin(mixin);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
