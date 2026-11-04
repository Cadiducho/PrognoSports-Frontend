<template>
  <PPage>
    <div v-if="isLoading">
      <loading />
    </div>
    <div v-else>
      <PField>
        <PInput
          v-model="filtro"
          placeholder="Buscar constructor"
          type="search"
          icon="fas fa-search"
        />
      </PField>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div
          v-if="filteredConstructors.length === 0"
          class="col-span-full rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          No hay constructores que coincidan con la busqueda.
        </div>
        <router-link
          v-for="team in filteredConstructors"
          :key="team.id"
          :to="{ name: 'constructorDetails', params: { team: team.id } }"
          class="c-card group flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 text-slate-700 shadow-md transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <span class="font-bold text-slate-800 dark:text-slate-100">{{ team.name }}</span>
        </router-link>
      </div>
    </div>
  </PPage>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { constructorService, notificationService } from "@/_services";
import Loading from "@/components/lib/Loading.vue";
import PField from "@/components/lib/forms/PField.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import { Constructor } from "@/types/Constructor";

defineOptions({ name: "ConstructorList" });

const constructorList = ref<Array<Constructor>>([]);
const filtro = ref("");
const isLoading = ref(true);

const filteredConstructors = computed((): Array<Constructor> => {
  const text = filtro.value.toLowerCase().trim();
  if (!text) {
    return constructorList.value;
  }
  return constructorList.value.filter((team) => {
    return team.name.toLowerCase().includes(text) || (team.longname ?? "").toLowerCase().includes(text);
  });
});

onMounted(() => {
  constructorService.getAllConstructors().then((teams) => {
    constructorList.value = [...teams].sort((a, b) => a.name.localeCompare(b.name));
  }).catch((error) => {
    notificationService.showNotification(error?.message, "error");
  }).finally(() => {
    isLoading.value = false;
  });
});

defineExpose({ filtro, filteredConstructors });
</script>
