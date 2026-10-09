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
const appName = isBeta ? 'PrognoSports (Beta)' : 'PrognoSports';
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
