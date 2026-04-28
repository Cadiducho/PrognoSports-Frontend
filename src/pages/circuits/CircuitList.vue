<template>
  <PTitle
    name="Lista de Circuitos"
  />
  <PCard
    id="circuitlist"
  >
    <div v-if="isLoading">
      <loading />
    </div>
    <div v-else>
      <PField>
        <PInput
          v-model="filtroCircuit"
          placeholder="Buscar circuito"
          type="search"
          icon="fas fa-search"
        />
      </PField>
      <div class="grid grid-cols-1 gap-5 md:auto-rows-fr md:grid-cols-2 xl:grid-cols-3">
        <div
          v-if="filteredCircuits.length === 0"
          class="col-span-full rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          No hay circuitos que coincidan con la busqueda.
        </div>
        <ViewCircuitItem
          v-for="(circuit, index) in filteredCircuits"
          :key="circuit.id ?? index"
          :circuit="circuit"
        />
      </div>
    </div>
  </PCard>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { circuitService } from "@/_services";
import ViewCircuitItem from "@/components/circuits/ViewCircuitItem.vue";
import Loading from "@/components/lib/Loading.vue";
import PField from "@/components/lib/forms/PField.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import PCard from "@/components/lib/PCard.vue";
import PTitle from "@/components/lib/PTitle.vue";
import { Circuit } from "@/types/Circuit";

defineOptions({ name: "CircuitList" });

const circuitList = ref<Array<Circuit>>([]);
const filtroCircuit = ref("");
const isLoading = ref(true);

const filteredCircuits = computed((): Array<Circuit> => {
  if (!filtroCircuit.value.trim()) {
    return circuitList.value;
  }

  const filtroLowerCase = filtroCircuit.value.toLowerCase().trim();

  return circuitList.value.filter((circuit) => {
    return (
      circuit.name.toLowerCase().includes(filtroLowerCase) ||
      circuit.country.toLowerCase().includes(filtroLowerCase) ||
      circuit.locality.toLowerCase().includes(filtroLowerCase) ||
      circuit.variants.map(v => v.name.toLowerCase()).some(v => v.includes(filtroLowerCase))
    );
  });
});

function loadCircuits(): void {
  circuitService.getCircuitList().then((circuits) => {
    circuitList.value.push(...circuits);
    isLoading.value = false;
  });
}

onMounted(() => {
  loadCircuits();
});

defineExpose({ filtroCircuit, filteredCircuits });
</script>
