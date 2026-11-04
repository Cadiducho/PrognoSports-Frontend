<template>
  <PPage
    :loading="isLoading"
    :subtitle="`Temporada ${season?.name}`"
  >
    <template #actions>
      <PButton
        tag="router-link"
        :to="{name: 'adminGpCreate'}"
        type="outline"
        icon="fa fa-plus"
      >
        Crear gran premio nuevo
      </PButton>
    </template>

    <form @submit.prevent="addGrandPrixToSeason">
      <p-select
        v-model="gpId"
        label="Gran Premio"
        placeholder="Selecciona un gran premio"
        class="mb-3"
      >
        <option
          v-for="gp in availableGps"
          :key="gp.id"
          :value="gp.id"
        >
          {{ gp.name }}
        </option>
      </p-select>

      <GrandPrixSeasonFields
        v-if="!isLoading"
        v-model="seasonData"
        :circuits="circuitList"
        :season="season"
      />

      <PButton
        class="mt-4"
        :disabled="!isDataOk || isSaving"
        native-type="submit"
        label="Añadir gran premio a la temporada"
      />
    </form>
  </PPage>
</template>

<script setup lang="ts">
import {circuitService, grandPrixService, notificationService, seasonService} from "@/_services";

import {computed, onMounted, ref} from "vue";
import PButton from "@/components/lib/forms/PButton.vue";
import {useRoute, useRouter} from "vue-router";
import PSelect from "@/components/lib/forms/PSelect.vue";
import {Season} from "@/types/Season";
import {GrandPrix} from "@/types/GrandPrix";
import {Circuit} from "@/types/Circuit";
import GrandPrixSeasonFields from "@/components/admin/seasons/GrandPrixSeasonFields.vue";
import {
  emptyGrandPrixSeasonModel,
  GrandPrixSeasonModel,
  grandPrixSeasonPayload,
  isGrandPrixSeasonModelValid
} from "@/components/admin/seasons/seasonLinkModels";
import {errorMessage} from "@/composables/errorMessage";

const router = useRouter();
const route = useRoute();

const isLoading = ref(true);
const isSaving = ref(false);
const season = ref({} as Season);
const gpsList = ref([] as Array<GrandPrix>);
const gpsInSeason = ref([] as Array<GrandPrix>);
const circuitList = ref([] as Array<Circuit>);
const gpId = ref<number | ''>('');
const seasonData = ref<GrandPrixSeasonModel>(emptyGrandPrixSeasonModel());

// Sólo los grandes premios que aún no están en la temporada
const availableGps = computed(() =>
  gpsList.value.filter(gp => !gpsInSeason.value.some(inSeason => inSeason.id === gp.id))
);

onMounted(async () => {
  try {
    season.value = await seasonService.getSeason(route.params.season as string);
    const [allGps, inSeason, circuits] = await Promise.all([
      grandPrixService.getAllGrandPrixes(),
      grandPrixService.getGrandPrixesList(season.value),
      circuitService.getCircuitList(),
    ]);
    gpsList.value = allGps;
    gpsInSeason.value = inSeason;
    circuitList.value = circuits;
  } catch (e) {
    notificationService.showNotification(errorMessage(e) ?? "Error al cargar los datos", "error");
  } finally {
    isLoading.value = false;
  }
});

const isDataOk = computed(() => gpId.value !== '' && isGrandPrixSeasonModelValid(seasonData.value));

const addGrandPrixToSeason = async () => {
  if (!isDataOk.value) return;
  isSaving.value = true;
  try {
    const result = await grandPrixService.linkGrandPrixToSeason(season.value.id, grandPrixSeasonPayload(gpId.value as number, seasonData.value));
    notificationService.showNotification("Se ha añadido correctamente el gran premio `" + (result?.name ?? '') + "`");

    await router.push({
      name: 'adminGpEditInSeason',
      params: {gp: gpId.value}
    })
  } catch (error) {
    notificationService.showNotification(errorMessage(error) ?? "No se ha podido añadir el gran premio", "error");
  } finally {
    isSaving.value = false;
  }
}
</script>
