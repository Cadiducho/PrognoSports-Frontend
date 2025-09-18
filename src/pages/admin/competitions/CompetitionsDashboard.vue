<template>
  <PCard>
    <PTitle
      class="mb-5"
      name="Administración de Competiciones"
    />

    <nav class="flex mb-4">
      <section class="flex flex-wrap">
        <p-button
          color="info"
          icon="fa fa-chevron-left"
          :to="{name: 'admin'}"
          tag="router-link"
          class="mr-2"
        >
          Volver a Administración
        </p-button>
        <p-button
          color="primary"
          icon="fa fa-plus"
          :to="{name: 'competitionCreate'}"
          tag="router-link"
        >
          Nueva Competicion
        </p-button>
      </section>
    </nav>

    <p-table
      :columns="columns"
      :rows="competitions"
      paginated
      has-edit-button
      has-delete-button
      @edit="goToEdit($event as Competition)"
      @delete="confirmDeleteCompetition($event as Competition)"
    />
  </PCard>

  <PrognoModal
    v-show="isDeleteCompetitionModalActive"
    @close="isDeleteCompetitionModalActive = false"
    @handle="deleteCompetition(competitionToDelete)"
  >
    <template #title>
      ¿Borrar competición?
    </template>
    <template #content>
      ¿Estás seguro de que quieres <b>eliminar</b> la competición <span class="has-text-weight-semibold">{{
        competitionToDelete.name }} (id: {{ competitionToDelete.id }})? <br>Esta acción se puede deshacer. </span>
    </template>
    <template #saveText>
      Borrar competición
    </template>
  </PrognoModal>
</template>

<script setup lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import PCard from "@/components/lib/PCard.vue";
import PTable from "@/components/lib/table/PTable.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PrognoModal from "@/components/lib/PrognoModal.vue";
import {competitionService, notificationService} from "@/_services";
import {Competition} from "@/types/Competition";

import {ref, onMounted} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();
const competitions = ref(new Array<Competition>());
const isDeleteCompetitionModalActive = ref(false);
const competitionToDelete = ref({} as Competition);

const columns = [
    {label: 'ID', field: 'id'},
    {label: 'Code', field: 'code'},
    {label: 'Nombre', field: 'name'},
    {label: 'Nombre completo', field: 'fullname'},
    {label: 'Temporada actual', field: 'currentSeason.id'},
];

onMounted(() => {
    competitionService.getCompetitionList().then((response) => {
        competitions.value = [];
        competitions.value.push(...response);
    });
});

const goToEdit = (competition: Competition) => {
    router.push({name: 'adminCompetitionEdit', params: {competition: competition.id.toString()}});
}

const confirmDeleteCompetition = (competition: Competition) => {
  competitionToDelete.value = competition;
  isDeleteCompetitionModalActive.value = true;
}
const deleteCompetition = (competition: Competition) => {
  competitionService.deleteCompetition(competition).then((ok) => {

    // Elimino de la lista y por lo tanto de la tabla
    competitions.value.splice(competitions.value.findIndex(s => s.id === competition.id), 1);

    notificationService.showNotification(`Se ha eliminado correctamente la competition ${competition.name} (#${competition.id})`, "success");
  }).catch((error) => {
    notificationService.showNotification(error.message, "error");
  });
}

</script>
