<script setup lang="ts">
import { computed } from "vue";
import type { GrandPrix } from "@/types/GrandPrix";
import type { NextGrandPrixSession } from "@/composables/useNextGrandPrix";
import PCard from "@/components/lib/PCard.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import HomeSessionRow from "@/components/home/HomeSessionRow.vue";
import {grandPrixPromoImageUrl, grandPrixLink} from "@/utils/grandPrix";

const props = defineProps<{
  grandPrix: GrandPrix;
  sessions: readonly NextGrandPrixSession[];
  doneCount: number;
}>();

const donePercentage = computed(() => (props.sessions.length === 0 ? 0 : Math.round((props.doneCount / props.sessions.length) * 100)));
const circuitInfo = computed(() => [props.grandPrix.circuit?.name, props.grandPrix.laps ? `${props.grandPrix.laps} vueltas` : null].filter(Boolean).join(" · "));
</script>

<template>
  <PCard>
    <div class="flex flex-col gap-6 md:flex-row">
      <div class="flex flex-col gap-2 md:w-64 md:flex-none">
        <span class="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">Próximo Gran Premio</span>
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {{ grandPrix.name }}
        </h2>
        <img
          v-if="grandPrix.hasPromoImage"
          :src="grandPrixPromoImageUrl(grandPrix)"
          :alt="`Imagen promocional del ${grandPrix.name}`"
          class="h-36 w-full rounded-lg object-cover"
          loading="lazy"
        >
        <span
          v-if="circuitInfo"
          class="text-sm text-gray-700 dark:text-gray-300"
        >{{ circuitInfo }}</span>
        <PButton
          tag="router-link"
          :to="grandPrixLink(grandPrix)"
          color="primary"
          type="solid"
          expanded
          class="mt-1"
        >
          Ver Gran Premio
        </PButton>
      </div>

      <section
        class="flex min-w-0 flex-1 flex-col gap-3"
        aria-labelledby="home-tipps-title"
      >
        <div class="flex items-center justify-between">
          <h3
            id="home-tipps-title"
            class="text-base font-semibold text-gray-900 dark:text-gray-100"
          >
            Tus pronósticos
          </h3>
          <span class="text-sm text-gray-600 dark:text-gray-400">{{ doneCount }} de {{ sessions.length }} hechos</span>
        </div>

        <div
          class="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800"
          role="progressbar"
          aria-label="Pronósticos hechos"
          :aria-valuenow="doneCount"
          aria-valuemin="0"
          :aria-valuemax="sessions.length"
        >
          <div
            class="h-1.5 rounded-full bg-brand-accent-500 transition-all"
            :style="{ width: `${donePercentage}%` }"
          />
        </div>

        <ul class="flex flex-col gap-2">
          <HomeSessionRow
            v-for="row in sessions"
            :key="row.session.id"
            :grand-prix="grandPrix"
            :row="row"
          />
        </ul>
      </section>
    </div>
  </PCard>
</template>
