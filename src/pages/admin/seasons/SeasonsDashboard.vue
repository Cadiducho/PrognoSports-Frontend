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
        <p>
          ¿Está seguro que desea eliminar la temporada <strong>{{ seasonToDelete?.name }}</strong>? Esta acción no se puede deshacer.
        </p>
        <p>
          También se quitarán sus pilotos y constructores. No se puede borrar si tiene Grandes Premios, reglas de comunidades o es la temporada actual de su competición.
        </p>
      </template>
      <template #footer>
        <p-button
          type="soft"
          @click="showConfirmDeleteModal = false"
        >
          Cancelar
        </p-button>
        <p-button
          color="danger"
          @click="deleteSeason(seasonToDelete)"
        >
          Eliminar
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
import {onMounted, ref} from "vue";
import {notificationService, seasonService} from "@/_services";
import {Season} from "@/types/Season";
import {errorMessage} from "@/composables/errorMessage";

const router = useRouter();

const columns = ref([
  { label: 'ID', field: 'id' },
  { label: 'Nombre', field: 'name' },
  { label: 'Competición', field: 'competition.name' },
  { label: 'Eventos Totales', field: 'totalEvents' },
]);
const seasons = ref(new Array<Season>())
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

onMounted(async () => {
    const response = await seasonService.getSeasonList();
    seasons.value.push(...response);
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
    showConfirmDeleteModal.value = false;
    try {
        await seasonService.deleteSeason(season);
        notificationService.showNotification("Se ha eliminado correctamente la temporada `" + season.name + "`", "success");
        seasons.value = seasons.value.filter(s => s.id !== season.id);
    } catch (e) {
        notificationService.showNotification(errorMessage(e) ?? "No se ha podido eliminar la temporada", "error");
    }
}
</script>
