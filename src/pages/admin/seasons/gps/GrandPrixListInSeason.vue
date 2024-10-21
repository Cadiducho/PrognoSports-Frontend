<template>
  <PCard>
    <PTitle
      v-if="chosenSeason.name"
      class="mb-5"
      :name="'Administración de Grandes Premios en la temporada ' + chosenSeason.name"
    />

    <nav class="flex justify-between mb-4">
      <section class="flex flex-wrap">
        <p-button
          color="info"
          icon="fa fa-chevron-left"
          :to="{name: 'adminGps'}"
          tag="router-link"
          class="mr-2"
        >
          Volver a lista de Grandes Premios
        </p-button>
        <p-button
          color="primary"
          icon="fa fa-plus"
          :to="{name: 'adminSeasonAddGrandPrix'}"
          tag="router-link"
        >
          Añadir Gran Premio a la temporada
        </p-button>
      </section>
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
      v-show="isDeleteGPModalActive"
      @close="isDeleteGPModalActive = false"
      @handle="deleteGrandPrixFromSeason(grandPrixToDelete)"
    >
      <template #title>
        ¿Eliminar Grand Prix de esta competición?
      </template>
      <template #content>
        ¿Estás seguro de que quieres <b>eliminar</b> el Gran Premio <span class="has-text-weight-semibold">{{ grandPrixToDelete.name }} {{ grandPrixToDelete.season?.name }}</span> de esta competición? <br>Esta acción se puede deshacer.
      </template>
      <template #saveText>
        Eliminar Grand Prix
      </template>
    </PrognoModal>
  </PCard>
</template>

<script setup lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import PTable from "@/components/lib/table/PTable.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PSelect from "@/components/lib/forms/PSelect.vue";
import PCard from "@/components/lib/PCard.vue";
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
/*
  grandPrixService.deleteGranPrix(gp).then((ok) => {

    // Elimino de la lista y por lo tanto de la tabla
    this.gps.splice(this.gps.findIndex(s => s.id === gp.id), 1);

    this.$oruga.notification.open({
      position: 'top',
      message: `Se ha eliminado correctamente el gran premio ${gp.name} #${gp.season.name}`,
      variant: "danger",
    });
  }).catch((error) => {
    this.$oruga.notification.open({
      position: 'top',
      message: error.message,
      variant: "danger",
    });
  });*/
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
