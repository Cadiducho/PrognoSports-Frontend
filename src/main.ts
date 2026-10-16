import {createApp} from 'vue'
import { createPinia } from 'pinia'
import { PiniaColada } from '@pinia/colada'
import './styles/app.css';
import App from "@/App.vue";
import Loading from '@/components/lib/Loading.vue'
import PPage from '@/components/lib/PPage.vue'
import router from "@/_router";
import {installSession} from "@/session";

const app = createApp(App)
    .use(createPinia())
    .use(PiniaColada, {
        queryOptions: {
            // Los datos se reutilizan sin volver a pedirse durante este tiempo; pasado, se refrescan al usarlos.
            // Tras cambiarlos desde la propia aplicación se invalidan a mano (ver src/queries).
            staleTime: 30_000,
        },
    })
    .use(router)
    .component("Loading", Loading)
    .component("PPage", PPage);

installSession(router);

app.mount('#app');
