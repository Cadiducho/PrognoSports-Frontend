<template>
  <PCard>
    <PTitle
      v-if="chosenSeason?.name"
      class="mb-5"
      :name="'Administración de Constructores en la temporada ' + chosenSeason.name"
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
          Volver a lista de Constructores
        </p-button>
        <p-button
          color="primary"
          icon="fa fa-plus"
          :to="{name: 'adminSeasonAddConstructor'}"
          tag="router-link"
        >
          Añadir Constructor a la temporada
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
      :rows="constructors"
      has-view-button
      has-edit-button
      has-delete-button
      :with-filter="filteredConstructors"
      @view="goToView($event as Constructor)"
      @edit="goToEdit($event as Constructor)"
      @delete="confirmDelete($event as Constructor)"
    />

    <PrognoModal
      v-show="isDeleteGPModalActive"
      @close="isDeleteGPModalActive = false"
      @handle="deleteFromSeason(constructorToDelete)"
    >
      <template #title>
        ¿Eliminar Constructor de esta competición?
      </template>
      <template #content>
        ¿Estás seguro de que quieres <b>eliminar</b> el Constructor
        <span class="has-text-weight-semibold">{{ constructorToDelete.name }}</span>
        de esta competición? <br>Esta acción no se puede deshacer.
      </template>
      <template #saveText>
        Eliminar Constructor
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
import {constructorService, seasonService} from "@/_services";
import { Season } from "@/types/Season";

import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import PrognoModal from "@/components/lib/PrognoModal.vue";
import {Constructor} from "@/types/Constructor";

const route = useRoute();
const router = useRouter();

const season = ref({ id: Number(route.params.season) } as Season);
const constructors = ref(new Array<Constructor>());
const seasonList = ref(new Array<Season>());
const chosenSeason = ref({} as Season);
const isDeleteGPModalActive = ref(false);
const constructorToDelete = ref({} as Constructor);

const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Nombre', field: 'name' },
  { label: 'Long name', field: 'longname' },
  { label: 'Color', field: 'teamcolor' }, // ToDo: mostrar colorcito de verdad
];

onMounted(() => {
  loadConstructors(season.value);

  seasonService.getSeasonList().then((seasons) => {
    seasonList.value = [];
    seasonList.value.push(...seasons);
    chosenSeason.value = seasonList.value.find((s) => s.id === season.value.id)!;
  });
});

const loadConstructors = (season: Season) => {
  constructorService.getConstructorsInSeason(season)
    .then((constructorList) => {
      constructors.value = [];
      constructors.value.push(...constructorList);
    })
}
const onChangeSeason = () => {
  loadConstructors(chosenSeason.value!);
}

const goToView = (cons: Constructor) => {
  router.push({name: 'adminSeasonEditConstructor', params: {season: season.value.id, constructor: cons.id}});
}

const goToEdit = (cons: Constructor) => {
  router.push({name: 'adminSeasonEditConstructor', params: {season: season.value.id, constructor: cons.id}});
}

const confirmDelete = (gp: Constructor) => {
  isDeleteGPModalActive.value = true;
  constructorToDelete.value = gp;
}

const deleteFromSeason = (gp: Constructor) => {
  console.log("deleteFromSeason", gp);
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


const filteredConstructors = ((original: Constructor[], filter: string): Constructor[] => {
  return original.filter(gp => {
    return (
      gp.id
        .toString()
        .includes(filter) ||
      gp.name
        .toLowerCase()
        .includes(filter) ||
      gp.longname
        .toLowerCase()
        .includes(filter)
    );
  });
});

</script>
