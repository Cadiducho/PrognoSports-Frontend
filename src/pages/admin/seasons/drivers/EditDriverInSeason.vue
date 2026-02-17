<template>
  <PCard>
    <PTitle
      v-if="season?.name && driver?.firstname"
      class="mb-5"
      :name="'Editar Piloto ' + driver.firstname + ' ' + driver.lastname + ' en la temporada ' + season.name"
    />

    <nav class="flex justify-between mb-4">
      <p-button
        color="info"
        icon="fa fa-chevron-left"
        :to="{name: 'adminDriversInSeason', params: {season: season.id}}"
        tag="router-link"
      >
        Volver a lista de Pilotos
      </p-button>
    </nav>

    <div
      v-if="isLoading"
      class="text-center py-8"
    >
      <i class="fas fa-spinner fa-spin text-4xl text-brand-accent-500" />
    </div>

    <form
      v-else
      @submit.prevent="updateDriver"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Información del piloto (solo lectura) -->
        <PField label="Nombre completo">
          <PInput
            :model-value="driver.firstname + ' ' + driver.lastname"
            disabled
            readonly
          />
        </PField>

        <PField label="Código">
          <PInput
            :model-value="driver.code"
            disabled
            readonly
          />
        </PField>

        <!-- Campos editables -->
        <PField
          label="Número"
          required
        >
          <PInput
            v-model.number="editedDriver.number"
            type="number"
            min="0"
            max="99"
            required
          />
        </PField>

        <PField
          label="Color"
          required
        >
          <ColorPicker
            v-model="editedDriver.color"
            required
          />
        </PField>
      </div>

      <div class="flex gap-2 mt-6">
        <PButton
          icon="fa fa-save"
          :disabled="!isFormValid || isSaving"
          @click="updateDriver"
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
  </PCard>
</template>

<script setup lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import PCard from "@/components/lib/PCard.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PField from "@/components/lib/forms/PField.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import ColorPicker from "@/components/lib/forms/ColorPicker.vue";
import { driversService, seasonService, notificationService } from "@/_services";
import { Season } from "@/types/Season";
import { Driver } from "@/types/Driver";
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const season = ref<Season>({} as Season);
const driver = ref<Driver>({} as Driver);
const editedDriver = ref({
  number: 0,
  color: ''
});
const isLoading = ref(true);
const isSaving = ref(false);

const isFormValid = computed(() => {
  const colorRegex = /^#?[0-9A-Fa-f]{6}$/;
  return (
    editedDriver.value.number >= 0 &&
    editedDriver.value.number <= 99 &&
    colorRegex.test(editedDriver.value.color)
  );
});

onMounted(async () => {
  try {
    const seasonId = route.params.season as string;
    const driverId = route.params.driver as string;

    const [seasonData, driversData] = await Promise.all([
      seasonService.getSeason(seasonId),
      driversService.getDriversInSeason({ id: Number(seasonId) } as Season)
    ]);

    season.value = seasonData;
    const foundDriver = driversData.find(d => d.id == driverId);

    if (!foundDriver) {
      notificationService.showNotification("Piloto no encontrado en esta temporada", "error");
      router.push({ name: 'adminDriversInSeason', params: { season: seasonId } });
      return;
    }

    driver.value = foundDriver;
    editedDriver.value = {
      number: foundDriver.number,
      color: foundDriver.color,
    };
  } catch (error) {
    notificationService.showNotification("Error al cargar los datos", "error");
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});

const resetForm = () => {
  editedDriver.value = {
    number: driver.value.number,
    color: driver.value.color.replace('#', '')
  };
};

const updateDriver = async () => {
  if (!isFormValid.value || isSaving.value) return;

  isSaving.value = true;
  try {
    const seasonId = route.params.season as string;
    const driverId = driver.value.id;

    await driversService.updateDriverInSeason(seasonId, driverId, {
      number: editedDriver.value.number,
      color: editedDriver.value.color,
    });

    notificationService.showNotification(
      `Piloto ${driver.value.firstname} ${driver.value.lastname} actualizado correctamente`,
      "success"
    );

    router.push({ name: 'adminDriversInSeason', params: { season: seasonId } });
  } catch (error) {
    notificationService.showNotification("Error al actualizar el piloto", "error");
    console.error(error);
  } finally {
    isSaving.value = false;
  }
};
</script>






