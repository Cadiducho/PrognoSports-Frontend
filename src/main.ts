import {createApp} from 'vue'
import { createPinia } from 'pinia'
import './styles/app.css';
import App from "@/App.vue";
import Loading from '@/components/lib/Loading.vue'
import PPage from '@/components/lib/PPage.vue'
import router from "@/_router";

const app = createApp(App)
    .use(createPinia())
    .use(router)
    .component("Loading", Loading)
    .component("PPage", PPage);

app.mount('#app');
