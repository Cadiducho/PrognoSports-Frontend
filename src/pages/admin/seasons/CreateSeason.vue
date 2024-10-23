<template>
  <PCard id="createSeason">
    <PTitle
      class="mb-5"
      name="Crear temporada"
    />
    <nav class="flex justify-between mb-4">
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


    <PInput
      v-model="createdSeason.name"
      label="Nombre de la temporada"
      placeholder="Nombre de la temporada"
      name="name"
    />
    <PInput
      v-model="createdSeason.totalEvents"
      label="Número de eventos totales"
      placeholder="Número de eventos totales"
      name="totalEvents"
      type="number"
    />

    <p-select
      v-model="createdSeason.competitionId"
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

    <PButton
      class="mt-4"
      :disabled="!isDataOk()"
      type="solid"
      label="Crear temporada"
      @click="registerSeason"
    />
  </PCard>
</template>

<script setup lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import {competitionService, notificationService, seasonService} from "@/_services";
import {Competition} from "@/types/Competition";

import {onMounted, reactive, ref} from "vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import {useRouter} from "vue-router";
import PCard from "@/components/lib/PCard.vue";
import PSelect from "@/components/lib/forms/PSelect.vue";

const router = useRouter();

const createdSeason = reactive({
  name: '',
  totalEvents: 0,
  competitionId: 0
});
const competitions = ref<Competition[]>([]);

onMounted(() => {
  competitionService.getCompetitionList().then((list) => {
    competitions.value = [];
    competitions.value.push(...list);
  })
});

const isDataOk = (): boolean => {
  return ((createdSeason.name.length > 0) && (createdSeason.totalEvents > 0) && (createdSeason.competitionId > 0))
}
const registerSeason = async () => {
  let rawSeason = {
    name: createdSeason.name,
    totalEvents: createdSeason.totalEvents,
    competition: createdSeason.competitionId
  }

  try {
    const result = await seasonService.createSeason(rawSeason);
    notificationService.showNotification("Se ha registrado correctamente la temporada `" + result.name + "`");

    router.push({
      name: 'adminSeasons'
    })
  } catch (error: any) {
    notificationService.showNotification(error.message, "error");
  }
}
</script>
