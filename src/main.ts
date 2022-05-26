import Vue from 'vue'
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

import Oruga from '@oruga-ui/oruga'
import { bulmaConfig } from '@oruga-ui/theme-bulma'

loadFilters(Vue);
loadLeaflet();

Vue.use(Oruga, {
    customIconPacks: {
        fas: {
            sizes: {
                default: '',
                small: 'fa-sm',
                medium: 'fa-lg',
                large: 'fa-2x'
            }
        }
    },
    iconPack: 'fas',
    ...bulmaConfig
})
Vue.use(VueClipboard);
Vue.config.productionTip = false;

Vue.component("Loading", Loading);
Vue.mixin(mixin);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
