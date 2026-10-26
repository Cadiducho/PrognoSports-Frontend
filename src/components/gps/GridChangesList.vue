<template>
  <div>
    <section v-if="changes.length">
      <h5 class="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
        Cambios respecto a {{ originName ?? 'la sesión anterior' }}
      </h5>
      <ul class="flex flex-col">
        <li
          v-for="change in changes"
          :key="change.driver.id"
          class="flex gap-3 border-t border-slate-100 py-2 text-sm first:border-t-0 dark:border-slate-700"
        >
          <span
            class="w-1 shrink-0 self-stretch rounded"
            :style="{ backgroundColor: `#${change.driver.team.teamcolor}` }"
          />
          <!-- La nota va debajo: en una columna estrecha no cabe al lado -->
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-baseline justify-between gap-x-3">
              <b>{{ change.driver.lastname }}</b>
              <span class="whitespace-nowrap">
                <span v-if="change.origin">{{ change.origin }}º → </span>
                <b :class="change.isFromPit ? 'text-info-700 dark:text-info-300' : 'text-warning-700 dark:text-warning-300'">
                  {{ change.isFromPit ? 'Pit lane' : `${change.position}º` }}
                </b>
              </span>
            </div>
            <p
              v-if="change.note"
              class="break-words text-slate-600 dark:text-slate-300"
            >
              {{ change.note }}
            </p>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {StartGridPosition} from "@/types/StartGridPosition";

const props = defineProps<{
  grid: Array<StartGridPosition>;
  /** Id del piloto -> posición en la sesión que define esta parrilla */
  origins: Map<string, number>;
  originName?: string;
}>();

// Solo los pilotos con una anotación del administrador: salen desde pit lane o llevan una nota
const changes = computed(() => props.grid
  .filter(gridPos => gridPos.isFromPit || gridPos.note)
  .map(gridPos => ({
    driver: gridPos.driver,
    position: gridPos.position,
    isFromPit: gridPos.isFromPit,
    note: gridPos.note,
    origin: props.origins.get(gridPos.driver.id),
  })));
</script>
