<script setup lang="ts">
import { computed } from "vue";
import type { FormStats } from "@/composables/charts/homeSeason";

const props = defineProps<{
  form: FormStats | null;
  /** false al ver el perfil de otro usuario: el texto pasa a tercera persona */
  own?: boolean;
}>();

const possessive = () => (props.own === false ? "su" : "tu");

const format = (value: number) => value.toLocaleString("es-ES");

const trend = computed(() => {
  if (!props.form) {
    return null;
  }
  const delta = Math.round((props.form.recentAverage - props.form.seasonAverage) * 10) / 10;
  if (delta > 0) {
    return { symbol: "▲", text: `+${format(delta)} sobre ${possessive()} media`, tone: "text-green-600 dark:text-green-400" };
  }
  if (delta < 0) {
    return { symbol: "▼", text: `${format(delta).replace("-", "−")} bajo ${possessive()} media`, tone: "text-red-600 dark:text-red-400" };
  }
  return { symbol: "=", text: `igual que ${possessive()} media`, tone: "text-gray-600 dark:text-gray-400" };
});
</script>

<template>
  <div>
    <ul
      v-if="form && trend"
      class="mt-3 flex flex-wrap gap-2 text-sm"
    >
      <li class="rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-800">
        <span class="block text-xs uppercase tracking-tight text-gray-600 dark:text-gray-400">
          Forma ({{ form.recentCount === 1 ? "último GP" : `últimos ${form.recentCount} GP` }})
        </span>
        <strong class="text-base text-gray-900 dark:text-gray-100">{{ format(form.recentAverage) }} pts/GP</strong>
        <span
          class="ml-2 font-semibold"
          :class="trend.tone"
        >
          <span aria-hidden="true">{{ trend.symbol }}</span>
          {{ trend.text }} ({{ format(form.seasonAverage) }})
        </span>
      </li>
      <li class="rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-800">
        <span class="block text-xs uppercase tracking-tight text-gray-600 dark:text-gray-400">
          Racha
        </span>
        <strong class="text-base text-gray-900 dark:text-gray-100">
          {{ form.streak }} {{ form.streak === 1 ? "GP" : "GPs" }}
        </strong>
        <span class="ml-2 text-gray-600 dark:text-gray-400">
          por encima de la media de la comunidad
        </span>
      </li>
    </ul>
  </div>
</template>
