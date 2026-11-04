<template>
  <PPage
    :title="driver?.firstname ? `Editar piloto ${driver.firstname} ${driver.lastname}` : undefined"
    :subtitle="season?.name ? `Temporada ${season.name}` : undefined"
    :loading="isLoading"
  >
    <form
      class="flex flex-col gap-4"
      @submit.prevent="updateDriver"
    >
      <!-- Información del piloto (solo lectura) -->
      <PFormGrid :cols="2">
        <PInput
          :model-value="`${driver.firstname} ${driver.lastname}`"
          label="Nombre completo"
          disabled
          readonly
        />
        <PInput
          :model-value="driver.code"
          label="Código"
          disabled
          readonly
        />
      </PFormGrid>

      <!-- Datos del piloto en la temporada -->
      <DriverSeasonFields v-model="editedDriver" />

      <div class="flex gap-2">
        <PButton
          native-type="submit"
          icon="fa fa-save"
          :disabled="!isFormValid || isSaving"
        >
          {{ isSaving ? 'Guardando...' : 'Guardar cambios' }}
        </PButton>

        <PButton
          color="info"
          icon="fa fa-undo"
          @click="resetForm"
        >
          Restablecer
        </PButton>
      </div>
    </form>
  </PPage>
</template>

<script setup lang="ts">
import PButton from "@/components/lib/forms/PButton.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import PFormGrid from "@/components/lib/forms/PFormGrid.vue";
import DriverSeasonFields from "@/components/admin/seasons/DriverSeasonFields.vue";
import {
  DriverSeasonModel,
  driverSeasonPayload,
  isDriverSeasonModelValid
} from "@/components/admin/seasons/seasonLinkModels";
import { driversService, seasonService, notificationService } from "@/_services";
import { errorMessage } from "@/composables/errorMessage";
import { Season } from "@/types/Season";
import { Driver } from "@/types/Driver";
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const season = ref<Season>({} as Season);
const driver = ref<Driver>({} as Driver);
const editedDriver = ref<DriverSeasonModel>({number: undefined, color: ''});
const isLoading = ref(true);
const isSaving = ref(false);

const isFormValid = computed(() => isDriverSeasonModelValid(editedDriver.value));

const modelFromDriver = (data: Driver): DriverSeasonModel => ({
  number: data.number,
  color: data.color ?? '',
});

onMounted(async () => {
  try {
    const seasonId = route.params.season as string;
    const driverId = route.params.driver as string;

    const [seasonData, driverData] = await Promise.all([
      seasonService.getSeason(seasonId),
      driversService.getDriverInSeason(seasonId, driverId),
    ]);

    season.value = seasonData;
    driver.value = driverData;
    editedDriver.value = modelFromDriver(driverData);
  } catch (error) {
    notificationService.showNotification(errorMessage(error) ?? "Piloto no encontrado en esta temporada", "error");
    await router.push({ name: 'adminDriversInSeason', params: { season: route.params.season } });
  } finally {
    isLoading.value = false;
  }
});

const resetForm = () => {
  editedDriver.value = modelFromDriver(driver.value);
};

const updateDriver = async () => {
  if (!isFormValid.value || isSaving.value) return;

  isSaving.value = true;
  try {
    const seasonId = route.params.season as string;
    const {number, color} = driverSeasonPayload(driver.value.id, editedDriver.value);

    await driversService.updateDriverInSeason(seasonId, driver.value.id, {number, color});

    notificationService.showNotification(`Piloto ${driver.value.firstname} ${driver.value.lastname} actualizado correctamente`);

    await router.push({ name: 'adminDriversInSeason', params: { season: seasonId } });
  } catch (error) {
    notificationService.showNotification(errorMessage(error) ?? "Error al actualizar el piloto", "error");
  } finally {
    isSaving.value = false;
  }
};
</script>
