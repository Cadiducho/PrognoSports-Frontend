import Vue from 'vue'
import { createPinia, PiniaVuePlugin } from 'pinia'
Vue.use(PiniaVuePlugin);
const pinia = createPinia();

// @ts-ignore
pinia.install(PiniaVuePlugin); // Hack para crear instancia de pinia en vue2 y que el router en beforeEach lo pueda usar

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

import router from '@/_router'
import App from '@/App.vue'

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
    pinia,
    router,
    render: h => h(App)
}).$mount('#app');
