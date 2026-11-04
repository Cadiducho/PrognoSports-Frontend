<template>
  <PPage>
    <nav class="mb-4 flex justify-between">
      <section class="flex flex-wrap">
        <p-button
          color="info"
          icon="fa fa-chevron-left"
          :to="{name: 'adminSeasons'}"
          tag="router-link"
          class="mr-2"
        >
          Volver listado de Temporadas
        </p-button>
      </section>
    </nav>

    <PFormGrid
      :cols="3"
      class="mb-4"
    >
      <p-select
        v-model="createdSeason.competitionId"
        label="Competición"
        placeholder="Selecciona una competición"
      >
        <option
          v-for="comp in competitions"
          :key="comp.id"
          :value="comp.id"
        >
          {{ comp.name }} ({{ comp.code }}) - {{ comp.fullname }}
        </option>
      </p-select>

      <PInput
        v-model="createdSeason.name"
        label="Nombre de la temporada"
        placeholder="2026"
        name="name"
      />

      <PField label="Número de eventos totales">
        <PNumberInput
          v-model="createdSeason.totalEvents"
          :min="1"
        />
      </PField>
    </PFormGrid>

    <PrognoAlert variant="info">
      Tras crearla podrás añadir sus pilotos, constructores y grandes premios.
    </PrognoAlert>

    <PButton
      :disabled="!isDataOk || isSaving"
      type="solid"
      label="Crear temporada"
      @click="registerSeason"
    />
  </PPage>
</template>

<script setup lang="ts">
import {competitionService, notificationService, seasonService} from "@/_services";
import {Competition} from "@/types/Competition";

import {computed, onMounted, reactive, ref} from "vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import PField from "@/components/lib/forms/PField.vue";
import PFormGrid from "@/components/lib/forms/PFormGrid.vue";
import PNumberInput from "@/components/lib/forms/PNumberInput.vue";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import {useRouter} from "vue-router";
import PSelect from "@/components/lib/forms/PSelect.vue";
import {errorMessage} from "@/composables/errorMessage";
import {isFilled, isIntAtLeast} from "@/utils/adminValidators";

const router = useRouter();

const createdSeason = reactive({
  name: '',
  totalEvents: undefined as number | undefined,
  competitionId: '' as number | '',
});
const competitions = ref<Competition[]>([]);
const isSaving = ref(false);

onMounted(() => {
  competitionService.getCompetitionList().then((list) => {
    competitions.value = list;
  })
});

const isDataOk = computed(() =>
  isFilled(createdSeason.name) && isIntAtLeast(createdSeason.totalEvents) && createdSeason.competitionId !== ''
);

const registerSeason = async () => {
  if (!isDataOk.value) return;
  isSaving.value = true;
  try {
    const result = await seasonService.createSeason({
      name: createdSeason.name.trim(),
      totalEvents: createdSeason.totalEvents!,
      competition: createdSeason.competitionId as number,
    });
    notificationService.showNotification("Se ha registrado correctamente la temporada `" + result.name + "`");

    await router.push({
      name: 'adminSeasonEdit',
      params: {season: result.id}
    })
  } catch (error) {
    notificationService.showNotification(errorMessage(error) ?? "No se ha podido crear la temporada", "error");
  } finally {
    isSaving.value = false;
  }
}
</script>
