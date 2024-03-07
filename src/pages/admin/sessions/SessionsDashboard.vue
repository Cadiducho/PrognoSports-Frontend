<template>
    <div id="sessionList" class="box">
        <PTitle class="mb-5" name="Administración de sesiones"/>

        <p-button class="mb-4" label="Nueva sesión" color="info" to="/admin/sessions/create" />

        <p-table :columns="columns" :rows="sessions"
                 hasEditButton hasDeleteButton paginated
                 :with-filter="filteredSessions"
                 @edit="goToEdit($event as RaceSession)"
                 @delete="confirmDeleteSeason($event as RaceSession)"
        >

        </p-table>

        <PrognoModal v-show="showConfirmDeleteModal" @close="showConfirmDeleteModal = false">
            <template v-slot:title>
                Confirmar eliminación
            </template>
            <template v-slot:content>
                ¿Está seguro que desea eliminar la sesión <strong>{{ sessionToDelete?.name }}</strong>? Esta acción no se puede deshacer.
            </template>
            <template v-slot:footer>
                <button class="button is-danger" @click="deleteSeason(sessionToDelete)">Eliminar</button>
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
import {notificationService, sessionService} from "@/_services";
import {RaceSession} from "@/types/RaceSession";

const router = useRouter();

const columns = ref( [
    {label: 'ID', field: 'id'},
    {label: 'Nombre', field: 'name'},
    {label: 'Código', field: 'code'},
    {label: 'Grid', field: 'hasGrid', type: 'boolean'},
    {label: 'FastLap', field: 'hasFastLap', type: 'boolean'},
] as Column[]);
const sessions = ref(new Array<RaceSession>())
const showConfirmDeleteModal = ref(false);
const sessionToDelete = ref(undefined as RaceSession | undefined);

const filteredSessions = ((original: RaceSession[], filter: string): RaceSession[] => {
    return original.filter((session) => {
        return (
            session.id
                .toString()
                .includes(filter) ||
            session.name
                .toLowerCase()
                .includes(filter) ||
            session.code
                .toLowerCase()
                .includes(filter)
        );
    });
});

onMounted(async () => {
    const response = await sessionService.getSessionList();
    sessions.value.push(...response);
});

const goToEdit = (session: RaceSession) => {
    router.push({name: 'adminSessionEdit', params: {session: session.id}});
}

const confirmDeleteSeason = (session: RaceSession) => {
    showConfirmDeleteModal.value = true;
    sessionToDelete.value = session;
}

const deleteSeason = async (session?: RaceSession) => {
    if (!session) {
        return;
    }
    try {
        await sessionService.deleteSession(session);
        notificationService.showNotification("Se ha eliminado correctamente la sesión `" + session.name + "`", "success");
        sessions.value.splice(sessions.value.findIndex(s => s.id === session.id),1);
        showConfirmDeleteModal.value = false;
    } catch (e: any) {
        notificationService.showNotification(e.response.data.message, "error");
        console.error(e.response.data.message);
    }
}
</script>