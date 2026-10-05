import {createApp} from 'vue'
import { createPinia } from 'pinia'
import './styles/app.css';
import VueApexCharts from "vue3-apexcharts";
import App from "@/App.vue";
import Loading from '@/components/lib/Loading.vue'
import router from "@/_router";

const app = createApp(App)
    .use(createPinia())
    .use(router)
    .use(VueApexCharts)
    .component("Loading", Loading);

app.mount('#app');
