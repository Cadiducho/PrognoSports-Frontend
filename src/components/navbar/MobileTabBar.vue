<script setup lang="ts">
import { computed } from "vue";
import type { RouteLocationRaw } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import { useNextGrandPrixLink } from "@/composables/useNextGrandPrixLink";

interface Tab {
  label: string;
  icon: string;
  to: RouteLocationRaw;
  /** Prefijo de ruta con el que la pestaña se considera activa */
  match: string[];
}

const authStore = useAuthStore();
const { link: nextGpLink } = useNextGrandPrixLink();

const tabs = computed<Tab[]>(() => [
  { label: "Inicio", icon: "home", to: { name: "home" }, match: ["/home"] },
  { label: "GP", icon: "flag", to: nextGpLink.value, match: ["/gps"] },
  { label: "Ranking", icon: "leaderboard", to: { name: "ranking" }, match: ["/ranking"] },
  { label: "Perfil", icon: "person", to: { name: "user", params: { user: authStore.loggedUser.id } }, match: ["/user", "/u/"] },
]);
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-30 flex border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] dark:border-gray-700 dark:bg-gray-900 md:hidden"
    aria-label="Navegación principal"
  >
    <router-link
      v-for="tab in tabs"
      :key="tab.label"
      v-slot="{ href, navigate }"
      :to="tab.to"
      custom
    >
      <a
        :href="href"
        class="flex min-h-16 flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium"
        :class="tab.match.some((prefix) => $route.path.startsWith(prefix))
          ? 'text-brand-700 dark:text-brand-300'
          : 'text-gray-600 dark:text-gray-400'"
        :aria-current="tab.match.some((prefix) => $route.path.startsWith(prefix)) ? 'page' : undefined"
        @click="navigate"
      >
        <i
          class="material-icons text-2xl leading-none"
          aria-hidden="true"
        >{{ tab.icon }}</i>
        {{ tab.label }}
      </a>
    </router-link>
  </nav>
</template>
