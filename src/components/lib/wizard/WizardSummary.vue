<template>
  <section class="flex flex-col items-start gap-4">
    <div class="flex items-center gap-3">
      <span class="flex h-10 w-10 items-center justify-center rounded-full bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300">
        <i
          class="fa fa-check"
          aria-hidden="true"
        />
      </span>
      <PTitle
        tag="h2"
        type="subtitle"
        no-margin
      >
        {{ title }}
      </PTitle>
    </div>

    <div v-if="seasons">
      <p
        v-if="!seasons.length"
        class="text-gray-600 dark:text-gray-300"
      >
        No se ha enlazado a ninguna temporada. Puedes hacerlo más tarde desde su ficha.
      </p>
      <template v-else>
        <p class="mb-2 text-gray-600 dark:text-gray-300">
          Enlazado a {{ seasons.length === 1 ? '1 temporada' : `${seasons.length} temporadas` }}:
        </p>
        <ul class="flex flex-wrap gap-2">
          <li
            v-for="season in seasons"
            :key="season.id"
          >
            <router-link
              v-if="seasonLink"
              :to="seasonLink(season)"
              class="inline-flex items-center gap-1.5 rounded-full border border-success-300 bg-success-50 px-3 py-1 text-sm text-success-800 hover:underline dark:border-success-700 dark:bg-success-900/30 dark:text-success-300"
            >
              {{ season.name }}
              <span class="text-xs opacity-75">{{ season.competition?.name }}</span>
            </router-link>
            <span
              v-else
              class="inline-flex rounded-full border border-success-300 bg-success-50 px-3 py-1 text-sm text-success-800 dark:border-success-700 dark:bg-success-900/30 dark:text-success-300"
            >{{ season.name }}</span>
          </li>
        </ul>
      </template>
    </div>

    <slot name="details" />

    <div class="flex flex-wrap gap-2">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import {RouteLocationRaw} from "vue-router";
import {Season} from "@/types/Season";
import PTitle from "@/components/lib/PTitle.vue";

/**
 * Último paso de un wizard de creación: confirma lo creado, las temporadas enlazadas y ofrece acciones (slot por defecto).
 */
withDefaults(defineProps<{
  title: string;
  seasons?: Season[];
  seasonLink?: (season: Season) => RouteLocationRaw;
}>(), {
  seasons: undefined,
  seasonLink: undefined,
});
</script>
