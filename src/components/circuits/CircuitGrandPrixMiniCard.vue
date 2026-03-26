<template>
  <article class="h-full">
    <router-link
      :to="gp.gpLink()"
      class="c-card group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white text-slate-700 shadow-md transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
    >
      <div class="flex flex-1 flex-col p-4">
        <h2 class="mt-2 text-base font-bold text-slate-800 dark:text-slate-100">
          {{ gp.name }} de {{ gp.season.name }}
        </h2>
        <span class="mb-2 mt-2 inline-block w-fit rounded-full bg-orange-200 px-2 py-1 text-xs font-semibold leading-none tracking-wide text-orange-800 dark:bg-orange-400/20 dark:text-orange-300">
          Ronda #{{ gp.round }}
        </span>
        <p class="text-sm text-slate-600 dark:text-slate-300">
          <template v-if="gp.circuit">
            {{ gp.circuit.name }}, {{ gp.circuit.locality }} ({{ gp.circuit.country }})
          </template>
          <template v-else>
            Circuito pendiente
          </template>
        </p>

        <div class="mt-auto border-t border-slate-200 pt-4 text-xs text-slate-700 dark:border-slate-700 dark:text-slate-200">
          <div
            v-for="(session, key) in gp.sessions"
            :key="session.id ?? key"
            class="mb-1 flex items-start justify-between gap-2 last:mb-0"
          >
            <b class="shrink-0">{{ session.humanName() }}:</b>
            <span class="text-right">
              {{ humanDateTime(session.date) }} ({{ dateDiff(session.date) }})
            </span>
          </div>
        </div>
      </div>
    </router-link>
  </article>
</template>

<script setup lang="ts">
import { useDayjs } from "@/composables/useDayjs";
import { GrandPrix } from "@/types/GrandPrix";

defineOptions({ name: "CircuitGrandPrixMiniCard" });

const { gp } = defineProps<{
  gp: GrandPrix;
}>();

const dayjs = useDayjs();
const { dateDiff, humanDateTime } = dayjs;

defineExpose({ gp, dateDiff, humanDateTime });
</script>

