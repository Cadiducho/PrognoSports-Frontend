<template>
  <section
    class="relative flex flex-col gap-1 rounded-lg border-l-4 bg-gray-50 p-4 pr-12 dark:bg-gray-800"
    :style="{ borderLeftColor: `#${gridPos.driver.team.teamcolor}` }"
    aria-live="polite"
  >
    <button
      type="button"
      class="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-200 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      aria-label="Cerrar el detalle del piloto"
      @click="emit('close')"
    >
      <i
        class="fa-solid fa-xmark"
        aria-hidden="true"
      />
    </button>
    <p class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
      {{ label }}
    </p>
    <p class="text-lg font-semibold">
      {{ gridPos.driver.firstname }} {{ gridPos.driver.lastname }} · #{{ gridPos.driver.number }}
    </p>
    <p class="text-sm text-gray-700 dark:text-gray-300">
      {{ summary }}
    </p>
    <p
      v-if="gridPos.note"
      class="mt-1 rounded-md px-3 py-2 text-sm"
      :class="gridPos.isFromPit
        ? 'bg-info-100 text-info-900 dark:bg-info-900/30 dark:text-info-100'
        : 'bg-warning-100 text-warning-900 dark:bg-warning-900/30 dark:text-warning-100'"
    >
      {{ gridPos.note }}
    </p>
  </section>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {StartGridPosition} from "@/types/StartGridPosition";
import {gridPenaltyPlaces} from "@/types/GridEntry";

const props = defineProps<{
  gridPos: StartGridPosition;
  /** Posición del piloto en la sesión que define esta parrilla, si se conoce */
  origin?: number;
  /** Nombre de esa sesión, por ejemplo "Clasificación" */
  originName?: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const label = computed(() => {
  if (props.gridPos.isFromPit) {
    return 'Sale desde pit lane';
  }
  if (gridPenaltyPlaces(props.gridPos.note ?? '') !== undefined) {
    return 'Sanción en parrilla';
  }
  return props.gridPos.note ? 'Con anotación' : 'Sin anotaciones';
});
const start = computed(() => props.gridPos.isFromPit ? 'sale desde pit lane' : `sale ${props.gridPos.position}º`);
const summary = computed(() => props.origin
  ? `${props.originName ?? 'Sesión anterior'}: ${props.origin}º · ${start.value}`
  : start.value.charAt(0).toUpperCase() + start.value.slice(1));
</script>
