<template>
  <PPage
    :title="constructor?.name ? `Editar constructor ${constructor.name}` : undefined"
    :subtitle="season?.name ? `Temporada ${season.name}` : undefined"
    :loading="isLoading"
  >
    <form
      class="flex flex-col gap-4"
      @submit.prevent="updateConstructor"
    >
      <!-- Información del constructor (solo lectura) -->
      <PFormGrid :cols="2">
        <PInput
          :model-value="constructor.name"
          label="Nombre"
          disabled
          readonly
        />
        <PInput
          :model-value="String(constructor.id ?? '')"
          label="ID"
          disabled
          readonly
        />
      </PFormGrid>

      <!-- Datos del constructor en la temporada -->
      <ConstructorSeasonFields v-model="editedConstructor" />

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
import ConstructorSeasonFields from "@/components/admin/seasons/ConstructorSeasonFields.vue";
import {
  ConstructorSeasonModel,
  constructorSeasonPayload,
  isConstructorSeasonModelValid
} from "@/components/admin/seasons/seasonLinkModels";
import { constructorService, seasonService, notificationService } from "@/_services";
import { errorMessage } from "@/composables/errorMessage";
import { Season } from "@/types/Season";
import { Constructor } from "@/types/Constructor";
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const season = ref<Season>({} as Season);
const constructor = ref<Constructor>({} as Constructor);
const editedConstructor = ref<ConstructorSeasonModel>({fullname: '', car: '', teamcolor: ''});
const isLoading = ref(true);
const isSaving = ref(false);

const isFormValid = computed(() => isConstructorSeasonModelValid(editedConstructor.value));

const modelFromConstructor = (data: Constructor): ConstructorSeasonModel => ({
  fullname: data.longname ?? '',
  car: data.carname ?? '',
  teamcolor: data.teamcolor ?? '',
});

onMounted(async () => {
  try {
    const seasonId = route.params.season as string;
    // `params.constructor` choca en tipos con Object.prototype.constructor
    const constructorId = String(route.params.constructor);

    const [seasonData, constructorData] = await Promise.all([
      seasonService.getSeason(seasonId),
      constructorService.getConstructorInSeason(seasonId, constructorId),
    ]);

    season.value = seasonData;
    constructor.value = constructorData;
    editedConstructor.value = modelFromConstructor(constructorData);
  } catch (error) {
    notificationService.showNotification(errorMessage(error) ?? "Constructor no encontrado en esta temporada", "error");
    await router.push({ name: 'adminConstructorsInSeason', params: { season: route.params.season } });
  } finally {
    isLoading.value = false;
  }
});

const resetForm = () => {
  editedConstructor.value = modelFromConstructor(constructor.value);
};

const updateConstructor = async () => {
  if (!isFormValid.value || isSaving.value) return;

  isSaving.value = true;
  try {
    const seasonId = route.params.season as string;
    const {fullname, car, teamcolor} = constructorSeasonPayload(constructor.value.id, editedConstructor.value);

    await constructorService.updateConstructorInSeason(seasonId, {id: constructor.value.id, fullname, car, teamcolor});

    notificationService.showNotification(`Constructor ${constructor.value.name} actualizado correctamente`);

    await router.push({ name: 'adminConstructorsInSeason', params: { season: seasonId } });
  } catch (error) {
    notificationService.showNotification(errorMessage(error) ?? "Error al actualizar el constructor", "error");
  } finally {
    isSaving.value = false;
  }
};
</script>
