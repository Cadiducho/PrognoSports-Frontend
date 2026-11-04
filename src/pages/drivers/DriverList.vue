<template>
  <PPage>
    <div v-if="isLoading">
      <loading />
    </div>
    <div v-else>
      <PField>
        <PInput
          v-model="filtroDriver"
          placeholder="Buscar piloto"
          type="search"
          icon="fas fa-search"
        />
      </PField>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div
          v-if="filteredDrivers.length === 0"
          class="col-span-full rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          No hay pilotos que coincidan con la busqueda.
        </div>
        <router-link
          v-for="driver in filteredDrivers"
          :key="driver.id"
          :to="{ name: 'driverDetails', params: { driver: driver.id } }"
          class="c-card group flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 text-slate-700 shadow-md transition duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <span class="flex h-12 w-14 shrink-0 items-center justify-center rounded-md bg-slate-200 text-lg font-black tracking-wider text-slate-800 dark:bg-slate-700 dark:text-slate-100">
            {{ driver.code }}
          </span>
          <span class="min-w-0">
            <span class="block truncate font-bold text-slate-800 dark:text-slate-100">
              {{ driver.firstname }} {{ driver.lastname }}
            </span>
            <span class="block text-sm text-slate-600 dark:text-slate-300">{{ driver.nationality }}</span>
          </span>
        </router-link>
      </div>
    </div>
  </PPage>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { driversService, notificationService } from "@/_services";
import Loading from "@/components/lib/Loading.vue";
import PField from "@/components/lib/forms/PField.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import { Driver } from "@/types/Driver";

defineOptions({ name: "DriverList" });

const driverList = ref<Array<Driver>>([]);
const filtroDriver = ref("");
const isLoading = ref(true);

const filteredDrivers = computed((): Array<Driver> => {
  const filtro = filtroDriver.value.toLowerCase().trim();
  if (!filtro) {
    return driverList.value;
  }

  return driverList.value.filter((driver) => {
    return (
      `${driver.firstname} ${driver.lastname}`.toLowerCase().includes(filtro) ||
      driver.code.toLowerCase().includes(filtro) ||
      (driver.nationality ?? "").toLowerCase().includes(filtro)
    );
  });
});

onMounted(() => {
  driversService.getAllDrivers().then((drivers) => {
    driverList.value = [...drivers].sort((a, b) => a.lastname.localeCompare(b.lastname));
  }).catch((error) => {
    notificationService.showNotification(error?.message, "error");
  }).finally(() => {
    isLoading.value = false;
  });
});

defineExpose({ filtroDriver, filteredDrivers });
</script>
