<template>
  <PPage>
    <template #actions>
      <p-button
        color="primary"
        icon="fa fa-plus"
        :to="{name: 'adminSeasonCreate'}"
        tag="router-link"
      >
        Nueva Temporada
      </p-button>
    </template>

    <p-table
      :columns="columns"
      :rows="seasons"
      has-view-button
      has-edit-button
      has-delete-button
      paginated
      :with-filter="filteredSeasons"
      @view="goToView($event as Season)"
      @edit="goToEdit($event as Season)"
      @delete="confirmDeleteSeason($event as Season)"
    />

    <PrognoModal
      v-model="showConfirmDeleteModal"
    >
      <template #title>
        Confirmar eliminación
      </template>
      <template #content>
        ¿Está seguro que desea eliminar la temporada <strong>{{ seasonToDelete?.name }}</strong>? Esta acción no se puede deshacer.
      </template>
      <template #footer>
        <p-button
          color="danger"
          @click="deleteSeason(seasonToDelete)"
        >
          Eliminar
        </p-button>
        <p-button
          type="soft"
          @click="showConfirmDeleteModal = false"
        >
          Cancelar
        </p-button>
      </template>
    </PrognoModal>
  </PPage>
</template>

<script setup lang="ts">
import PrognoModal from "@/components/lib/PrognoModal.vue";
import PTable from "@/components/lib/table/PTable.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import {useRouter} from "vue-router";
import {computed, ref} from "vue";
import {useQuery} from "@pinia/colada";
import {notificationService} from "@/_services";
import {seasonListQuery, useDeleteSeason} from "@/queries/seasons";
import {Season} from "@/types/Season";

const router = useRouter();

const columns = ref([
  { label: 'ID', field: 'id' },
  { label: 'Nombre', field: 'name' },
  { label: 'Competición', field: 'competition.name' },
  { label: 'Eventos Totales', field: 'totalEvents' },
]);
// La lista sale de la caché de consultas: se actualiza sola al crear, editar o eliminar una temporada
const {data: seasonData} = useQuery(seasonListQuery);
const seasons = computed(() => seasonData.value ?? []);
const {mutateAsync: deleteSeasonMutation} = useDeleteSeason();
const showConfirmDeleteModal = ref(false);
const seasonToDelete = ref(undefined as Season | undefined);

const filteredSeasons = ((original: Season[], filter: string): Season[] => {
    return original.filter((season) => {
        return (
            season.id
                .toString()
                .includes(filter) ||
            season.name
                .toLowerCase()
                .includes(filter) ||
            season.competition.name
                .toLowerCase()
                .includes(filter) ||
            season.competition.code
                .toLowerCase()
                .includes(filter)
        );
    });
});

const goToView = (season: Season) => {
    router.push({name: 'adminGpsInSeason', params: {season: season.id}});
}

const goToEdit = (season: Season) => {
    router.push({name: 'adminSeasonEdit', params: {season: season.id}});
}

const confirmDeleteSeason = (season: Season) => {
    showConfirmDeleteModal.value = true;
    seasonToDelete.value = season;
}

const deleteSeason = async (season?: Season) => {
    if (!season) {
        return;
    }
    try {
        await deleteSeasonMutation(season);
        notificationService.showNotification("Se ha eliminado correctamente la temporada `" + season.name + "`", "success");
        showConfirmDeleteModal.value = false;
    } catch (e: any) {
        notificationService.showNotification(e.response.data.message, "error");
        console.error(e.response.data.message);
    }
}
</script>
