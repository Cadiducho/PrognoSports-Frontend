<script setup lang="ts">
import { computed } from "vue";
import type { GrandPrix } from "@/types/GrandPrix";
import type { NextGrandPrixSession } from "@/composables/useNextGrandPrix";
import { countdownParts } from "@/composables/useNextGrandPrix";
import {sessionClosureDate, sessionHumanName} from "@/utils/raceSession";

const props = defineProps<{
  grandPrix: GrandPrix;
  /** Sesión abierta cuyo cierre se cuenta atrás; null si todas están cerradas */
  closure: NextGrandPrixSession | null;
  now: Date;
}>();

const blocks = computed(() => {
  if (!props.closure) {
    return [];
  }
  const { days, hours, minutes } = countdownParts(sessionClosureDate(props.closure.session), props.now);
  return [
    { value: String(days).padStart(2, "0"), label: "días" },
    { value: String(hours).padStart(2, "0"), label: "horas" },
    { value: String(minutes).padStart(2, "0"), label: "min" },
  ];
});
</script>

<template>
  <section class="flex flex-col gap-2 rounded-lg bg-brand-900 p-4 text-white shadow-lg shadow-black/10 ring-1 ring-black/5 md:hidden">
    <span class="text-xs font-semibold uppercase tracking-wide text-brand-200">
      Próximo Gran Premio · Ronda {{ grandPrix.round }}
    </span>
    <h2 class="text-2xl font-semibold">
      {{ grandPrix.name }}
    </h2>

    <template v-if="closure">
      <div
        class="flex gap-2"
        role="timer"
        :aria-label="`Quedan ${blocks[0]?.value} días, ${blocks[1]?.value} horas y ${blocks[2]?.value} minutos para el cierre`"
      >
        <div
          v-for="block in blocks"
          :key="block.label"
          class="flex flex-1 flex-col items-center rounded-md bg-brand-700 py-2"
          aria-hidden="true"
        >
          <span class="text-2xl font-bold tabular-nums">{{ block.value }}</span>
          <span class="text-xs text-brand-100">{{ block.label }}</span>
        </div>
      </div>
      <span class="text-sm text-brand-100">para el cierre de {{ sessionHumanName(closure.session) }}</span>
    </template>
    <span
      v-else
      class="text-sm text-brand-100"
    >Todas las sesiones de este fin de semana están cerradas</span>
  </section>
</template>
