<template>
    <div id="seasonList" class="box">
        <PTitle class="mb-5" name="Administración de temporadas"/>

        <p-button class="mb-4" label="Nueva temporada" color="info" to="/admin/seasons/create" />

        <p-table :columns="columns" :rows="seasons"
                 hasViewButton hasEditButton hasDeleteButton paginated
                 :with-filter="filteredSeasons"
                 @view="goToView($event as Season)"
                 @edit="goToEdit($event as Season)"
                 @delete="confirmDeleteSeason($event as Season)"
        >

        </p-table>

        <PrognoModal v-show="showConfirmDeleteModal" @close="showConfirmDeleteModal = false">
            <template v-slot:title>
                Confirmar eliminación
            </template>
            <template v-slot:content>
                ¿Está seguro que desea eliminar la temporada <strong>{{seasonToDelete?.name}}</strong>? Esta acción no se puede deshacer.
            </template>
            <template v-slot:footer>
                <button class="button is-danger" @click="deleteSeason(seasonToDelete)">Eliminar</button>
                <button class="button" @click="showConfirmDeleteModal = false">Cancelar</button>
            </template>
        </PrognoModal>
    </div>
</template>

<script setup lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import PrognoModal from "@/components/lib/PrognoModal.vue";
import PTable from "@/components/lib/table/PTable.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {notificationService, seasonService} from "@/_services";
import {Season} from "@/types/Season";

const router = useRouter();

const columns = ref( [
    {label: 'ID', field: 'id'},
    {label: 'Nombre', field: 'name'},
    {label: 'Competición', field: 'competition.name'},
    {label: 'Código', field: 'competition.code'},
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
    try {
        await seasonService.deleteSeason(season);
        notificationService.showNotification("Se ha eliminado correctamente la temporada `" + season.name + "`", "success");
        seasons.value.splice(seasons.value.findIndex(s => s.id === season.id),1);
        showConfirmDeleteModal.value = false;
    } catch (e: any) {
        notificationService.showNotification(e.response.data.message, "error");
        console.error(e.response.data.message);
    }
}
</script>