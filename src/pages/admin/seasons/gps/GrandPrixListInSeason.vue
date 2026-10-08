<template>
  <PPage :subtitle="chosenSeason?.name ? `Temporada ${chosenSeason.name}` : undefined">
    <template #actions>
      <p-button
        color="primary"
        icon="fa fa-plus"
        :to="{name: 'adminSeasonAddGrandPrix'}"
        tag="router-link"
      >
        Añadir Gran Premio a la temporada
      </p-button>
    </template>

    <nav class="mb-4 flex justify-end">
      <section class="flex flex-wrap">
        <p-button
          color="info"
          icon="fa fa-cogs"
          :to="{name: 'adminSeasonEdit', params: {season: chosenSeason.id}}"
          tag="router-link"
          class="mr-2"
        >
          Administración de Temporada
        </p-button>
        <p-select
          v-if="seasonList"
          v-model="chosenSeason"
          placeholder="Selecciona la temporada"
          @change="onChangeSeason()"
        >
          <option
            v-for="ses in seasonList"
            :key="ses.id"
            :value="ses"
          >
            {{ ses.name }} (#{{ ses.id }}) - {{ ses.competition.name }}
          </option>
        </p-select>
      </section>
    </nav>

    <p-table
      :columns="columns"
      :rows="gps"
      has-view-button
      has-edit-button
      has-delete-button
      :with-filter="filteredGps"
      @view="goToView($event as GrandPrix)"
      @edit="goToEdit($event as GrandPrix)"
      @delete="confirmDeleteGrandPrix($event as GrandPrix)"
    />

    <PrognoModal
      v-model="isDeleteGPModalActive"
      @handle="deleteGrandPrixFromSeason(grandPrixToDelete)"
    >
      <template #title>
        ¿Eliminar Grand Prix de esta competición?
      </template>
      <template #content>
        ¿Estás seguro de que quieres <b>eliminar</b> el Gran Premio <span class="font-semibold">{{ grandPrixToDelete.name }} {{ grandPrixToDelete.season?.name }}</span> de esta competición? <br>Esta acción se puede deshacer.
      </template>
      <template #saveText>
        Eliminar Grand Prix
      </template>
    </PrognoModal>
  </PPage>
</template>

<script setup lang="ts">
import PTable from "@/components/lib/table/PTable.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PSelect from "@/components/lib/forms/PSelect.vue";
import { grandPrixService, seasonService } from "@/_services";
import { GrandPrix } from "@/types/GrandPrix";
import { Season } from "@/types/Season";

import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import PrognoModal from "@/components/lib/PrognoModal.vue";

const route = useRoute();
const router = useRouter();

const season = ref({ id: Number(route.params.season) } as Season);
const gps = ref(new Array<GrandPrix>());
const seasonList = ref(new Array<Season>());
const chosenSeason = ref({} as Season);
const isDeleteGPModalActive = ref(false);
const grandPrixToDelete = ref({} as GrandPrix);

const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Ronda', field: 'round', formatter: (value: number) => `#${value}º` },
  { label: 'Nombre', field: 'name' },
  { label: 'Código', field: 'code' },
  { label: 'Vueltas', field: 'laps' },
  { label: 'Circuito', field: 'circuit.name' },
  { label: 'Localidad', field: 'circuit.locality' },
  { label: 'País', field: 'circuit.country' },
  { label: 'Sessions', field: 'sessions', formatter: (value: any[]) => value.map(s => s.name).join(', ') }
];

onMounted(() => {
  loadGrandPrixes(season.value);

  seasonService.getSeasonList().then((seasons) => {
    seasonList.value = [];
    seasonList.value.push(...seasons);
    chosenSeason.value = seasonList.value.find((s) => s.id === season.value.id)!;
  });
});

const loadGrandPrixes = (season: Season) => {
  grandPrixService.getGrandPrixesList(season)
    .then((gpsList) => {
      gps.value = [];
      gps.value.push(...gpsList);
    })
}
const onChangeSeason = () => {
  loadGrandPrixes(chosenSeason.value!);
}

const goToView = (gp: GrandPrix) => {
    router.push({name: 'gpdetails', params: {season: gp.season.id, competition: gp.competition.id, gp: gp.id}});
}

const goToEdit = (gp: GrandPrix) => {
    router.push({name: 'adminGpEditInSeason', params: {gp: gp.id}});
}

const confirmDeleteGrandPrix = (gp: GrandPrix) => {
  isDeleteGPModalActive.value = true;
  grandPrixToDelete.value = gp;
}

const deleteGrandPrixFromSeason = (gp: GrandPrix) => {
  console.log("deleteGrandPrixFromSeason", gp);
}


const filteredGps = ((original: GrandPrix[], filter: string): GrandPrix[] => {
  return original.filter(gp => {
    return (
      gp.id
        .toString()
        .includes(filter) ||
      gp.name
        .toLowerCase()
        .includes(filter) ||
      gp.code
        .toLowerCase()
        .includes(filter) ||
      gp.circuit?.name
        .toLowerCase()
        .includes(filter) ||
      gp.circuit?.locality
        .toLowerCase()
        .includes(filter) ||
      gp.circuit?.country
        .toLowerCase()
        .includes(filter)
    );
  });
});

</script>
