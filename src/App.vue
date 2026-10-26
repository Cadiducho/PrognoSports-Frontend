<template>
  <div
    id="app"
    class="transition-all dark:bg-gray-800 bg-neutral-100 font-sans min-h-screen flex flex-col"
  >
    <Toaster
      rich-colors
      :position="toastStore.position"
    />

    <!-- La app siempre cargará router-view -->
    <!-- Las nested routes se encargarán de hacer aparecer unos u otros componentes, -->
    <!-- según si está iniciado sesión o la url solicitada -->

    <router-view :key="$route.fullPath" />

    <ToTop :scroll-y="200" />

    <!-- Solo en `pnpm dev:prod`: servidor de desarrollo contra la API de producción -->
    <div
      v-if="isDevAgainstProd"
      class="fixed bottom-0 inset-x-0 z-[9999] bg-red-600 text-white text-center text-xs font-bold py-1 pointer-events-none"
    >
      ⚠ MODO DESARROLLO CONTRA PRODUCCIÓN: los cambios afectan a datos reales ({{ apiUrl }})
    </div>
  </div>
</template>

<script setup lang="ts">
import ToTop from "@/components/lib/ToTop.vue";
import 'vue-sonner/style.css'
import { Toaster } from 'vue-sonner'
import {useToastStore} from "@/store/toastStore";
import { useTitle } from '@vueuse/core'
import {watchEffect} from "vue";
import {useRoute} from "vue-router";
import {useThemeStore} from "@/store/themeStore";
import {usePageStore} from "@/store/pageStore";

const toastStore = useToastStore();
const styleStore = useThemeStore();

const isBeta = import.meta.env.MODE == 'beta';
console.log("isBeta", isBeta);
// `pnpm dev:prod`: servidor de desarrollo (DEV) con --mode production
const isDevAgainstProd = import.meta.env.DEV && import.meta.env.MODE == 'production';
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const appName = isBeta ? 'PrognoSports (Beta)' : isDevAgainstProd ? '[PROD] PrognoSports' : 'PrognoSports';
const route = useRoute();
const pageStore = usePageStore();
const title = useTitle();
// El título de la pestaña sigue al de la página: "Monza · PrognoSports"
watchEffect(() => {
    const pageTitle = pageStore.title ?? route.meta.title;
    title.value = pageTitle ? `${pageTitle} · ${appName}` : appName;
});

const darkMode = styleStore.darkMode;
styleStore.setDarkMode(darkMode);

</script>
