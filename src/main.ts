import {createApp} from 'vue'
import { createPinia } from 'pinia'
import Oruga from '@oruga-ui/oruga-next';
import { bulmaConfig } from '@oruga-ui/theme-bulma'

import './scss/app.scss';
import {VueClipboard} from "@soerenmartius/vue3-clipboard";
import VueApexCharts from "vue3-apexcharts";
import mixin from "@/plugins/mixin";
import App from "@/App.vue";
import Loading from '@/components/lib/Loading.vue'
import router from "@/_router";

const app = createApp(App)
    .use(createPinia())
    .use(router)
    .use(Oruga, {
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
        ...bulmaConfig}
    )
    .use(VueApexCharts)
    .use(VueClipboard)
    .component("Loading", Loading)
    .mixin(mixin);

app.mount('#app');
