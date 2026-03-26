<template>
  <article class="h-full">
    <router-link
      :to="circuit.circuitLink()"
      class="c-card group flex h-full min-h-[24rem] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white text-slate-700 shadow-md transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
    >
      <div class="relative h-48 overflow-hidden bg-slate-50 dark:bg-slate-900/40">
        <img
          class="absolute inset-0 h-full w-full object-contain p-3"
          :src="circuit.layoutImage()"
          alt=""
        >
      </div>

      <div class="flex flex-1 flex-col p-4">
        <h2 class="mb-2 text-base font-bold text-slate-800 dark:text-slate-100">
          {{ circuit.name }}
        </h2>
        <p class="text-sm text-slate-600 dark:text-slate-300">
          {{ circuit.locality }} ({{ circuit.country }})
        </p>

        <div class="mt-auto border-t border-slate-200 pt-4 text-xs text-slate-700 dark:border-slate-700 dark:text-slate-200">
          <div
            v-for="(variant, key) in circuit.variants"
            :key="variant.name + key"
            class="mb-1 flex items-start justify-between gap-2 last:mb-0"
          >
            <b class="shrink-0">{{ variant.name }}:</b>
            <span class="text-right">{{ variant.distance }}km ({{ variant.turns }} curvas)</span>
          </div>
        </div>
      </div>
    </router-link>
  </article>
</template>

<script setup lang="ts">
import { Circuit } from "@/types/Circuit";

defineOptions({ name: "ViewCircuitItem" });

const { circuit } = defineProps<{
  circuit: Circuit;
}>();

defineExpose({ circuit });
</script>
