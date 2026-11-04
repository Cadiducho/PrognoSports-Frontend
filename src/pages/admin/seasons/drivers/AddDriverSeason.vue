<template>
  <PPage
    :loading="isLoading"
    :subtitle="`Temporada ${season?.name}`"
  >
    <template #actions>
      <PButton
        tag="router-link"
        :to="{name: 'adminDriverCreate'}"
        type="outline"
        icon="fa fa-plus"
      >
        Crear piloto nuevo
      </PButton>
    </template>

    <form @submit.prevent="addDriverToSeason">
      <p-select
        v-model="driverId"
        label="Piloto"
        placeholder="Selecciona un piloto"
        class="mb-3"
      >
        <option
          v-for="driver in availableDrivers"
          :key="driver.id"
          :value="driver.id"
        >
          {{ driver.firstname }} {{ driver.lastname }} (#{{ driver.code }})
        </option>
      </p-select>

      <DriverSeasonFields v-model="seasonData" />

      <PButton
        class="mt-4"
        :disabled="!isDataOk || isSaving"
        native-type="submit"
        label="Agregar piloto a la temporada"
      />
    </form>
  </PPage>
</template>

<script setup lang="ts">
import {driversService, notificationService, seasonService} from "@/_services";

import {computed, onMounted, ref} from "vue";
import PButton from "@/components/lib/forms/PButton.vue";
import {useRoute, useRouter} from "vue-router";
import PSelect from "@/components/lib/forms/PSelect.vue";
import {Season} from "@/types/Season";
import {Driver} from "@/types/Driver";
import DriverSeasonFields from "@/components/admin/seasons/DriverSeasonFields.vue";
import {
  DriverSeasonModel,
  driverSeasonPayload,
  emptyDriverSeasonModel,
  isDriverSeasonModelValid
} from "@/components/admin/seasons/seasonLinkModels";
import {errorMessage} from "@/composables/errorMessage";

const router = useRouter();
const route = useRoute();

const isLoading = ref(true);
const isSaving = ref(false);
const season = ref({} as Season);
const driversList = ref([] as Array<Driver>);
const driversInSeason = ref([] as Array<Driver>);
const driverId = ref<number | ''>('');
const seasonData = ref<DriverSeasonModel>(emptyDriverSeasonModel());

// Sólo los pilotos que aún no están en la temporada
const availableDrivers = computed(() =>
  driversList.value.filter(driver => !driversInSeason.value.some(inSeason => inSeason.id === driver.id))
);

onMounted(async () => {
  try {
    season.value = await seasonService.getSeason(route.params.season as string);
    const [allDrivers, inSeason] = await Promise.all([
      driversService.getAllDrivers(),
      driversService.getDriversInSeason(season.value),
    ]);
    driversList.value = allDrivers;
    driversInSeason.value = inSeason;
  } catch (e) {
    notificationService.showNotification(errorMessage(e) ?? "Error al cargar los datos", "error");
  } finally {
    isLoading.value = false;
  }
});

const isDataOk = computed(() => driverId.value !== '' && isDriverSeasonModelValid(seasonData.value));

const addDriverToSeason = async () => {
  if (!isDataOk.value) return;
  isSaving.value = true;
  try {
    const result = await driversService.linkDriverToSeason(season.value, driverSeasonPayload(driverId.value as number, seasonData.value));
    notificationService.showNotification("Se ha añadido correctamente el piloto `" + result.code + "`");

    await router.push({
      name: 'adminDriversInSeason'
    });
  } catch (error) {
    notificationService.showNotification(errorMessage(error) ?? "No se ha podido añadir el piloto", "error");
  } finally {
    isSaving.value = false;
  }
}
</script>
