<template>
  <PField>
    <PInput
      v-model="filtroGps"
      placeholder="Buscar Gran Premio"
      type="search"
      icon="fas fa-search"
    />
  </PField>
  <div class="grid grid-cols-1 gap-5 md:auto-rows-fr md:grid-cols-2 xl:grid-cols-3">
    <div
      v-if="filteredGrandPrixes.length === 0"
      class="col-span-full rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
    >
      No hay grandes premios aquí... de momento
    </div>
    <GrandPrixItem
      v-for="(grandprix, index) in filteredGrandPrixes"
      :key="grandprix.name + index"
      :gp="grandprix"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import GrandPrixItem from "@/components/gps/list/GrandPrixItem.vue";
import PField from "@/components/lib/forms/PField.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import { GrandPrix } from "@/types/GrandPrix";

defineOptions({ name: "GrandPrixesList" });

const props = defineProps<{
  gps: Array<GrandPrix>;
}>();

const filtroGps = ref("");

const filteredGrandPrixes = computed((): Array<GrandPrix> => {
  if (!filtroGps.value.trim()) {
    return props.gps;
  }

  const filtroLowerCase = filtroGps.value.toLowerCase().trim();

  return props.gps.filter((gp) => {
    return (
      gp.name.toLowerCase().includes(filtroLowerCase) ||
      gp.code.toLowerCase().includes(filtroLowerCase) ||
      gp.circuit?.name.toLowerCase().includes(filtroLowerCase) ||
      gp.circuit?.country.toLowerCase().includes(filtroLowerCase) ||
      gp.circuit?.locality.toLowerCase().includes(filtroLowerCase)
    );
  });
});

defineExpose({ filtroGps, filteredGrandPrixes });
</script>
