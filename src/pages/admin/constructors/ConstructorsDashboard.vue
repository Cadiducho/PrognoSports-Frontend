<template>
    <div id="adminConstructor" class="box">
        <PrognoPageTitle class="mb-5" name="Administración de Constructores"/>


        <p-button class="mb-4" label="Nuevo constructor" color="info" to="/admin/constructors/create" />

        <p-table :columns="columns" :rows="constructors"
                 hasViewButton hasEditButton hasDeleteButton paginated
                 :with-filter="filteredConstructors"
                 @view="goToView($event as Constructor)"
                 @edit="goToEdit($event as Constructor)"
                 @delete="confirmDeleteConstructor($event as Constructor)"
        >

        </p-table>

        <PrognoModal v-show="showConfirmDeleteModal" @close="showConfirmDeleteModal = false">
            <template v-slot:title>
                Confirmar eliminación
            </template>
            <template v-slot:content>
                ¿Está seguro que desea eliminar el constructor <strong>{{constructorToDelete?.name}}</strong>? Esta acción no se puede deshacer.
            </template>
            <template v-slot:footer>
                <button class="button is-danger" @click="deleteConstructor(constructorToDelete)">Eliminar</button>
                <button class="button" @click="showConfirmDeleteModal = false">Cancelar</button>
            </template>
        </PrognoModal>
    </div>
</template>

<script setup lang="ts">
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import {constructorService, notificationService} from "@/_services";
import {Constructor} from "@/types/Constructor";
import PButton from "@/components/lib/forms/PButton.vue";
import PTable from "@/components/lib/table/PTable.vue";
import PrognoModal from "@/components/lib/PrognoModal.vue";
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();

const columns = ref( [
    {label: 'ID', field: 'id'},
    {label: 'Nombre', field: 'name'},
]);
const constructors = ref(new Array<Constructor>())
const showConfirmDeleteModal = ref(false);
const constructorToDelete = ref(undefined as Constructor | undefined);

const filteredConstructors = ((original: Constructor[], filter: string): Constructor[] => {
    return original.filter((constructor) => {
        return (
            constructor.id
                .toString()
                .includes(filter) ||
            constructor.name
                .toLowerCase()
                .includes(filter)
        );
    });
});

onMounted(async () => {
    const response = await constructorService.getAllConstructors();
    constructors.value.push(...response);
});

const goToView = (constructor: Constructor) => {
    router.push({name: 'constructorDetails', params: {constructorId: constructor.id}});
}

const goToEdit = (constructor: Constructor) => {
    router.push({name: 'adminConstructorEdit', params: {constructorId: constructor.id}});
}
const confirmDeleteConstructor = (constructor: Constructor) => {
    constructorToDelete.value = constructor;
    showConfirmDeleteModal.value = true;
}

const deleteConstructor = async (constructor?: Constructor) => {
    try {
        if (!constructor) {
            return;
        }
        await constructorService.deleteConstructor(constructor);
        constructors.value.splice(constructors.value.findIndex(s => s.id === constructor.id),1);
        notificationService.showNotification(`Se ha eliminado correctamente el constructor ${constructor.name} (#${constructor.id})`);
    } catch (error: any) {
        notificationService.showNotification(error.message, "error");
    } finally {
        showConfirmDeleteModal.value = false;
    }
}
</script>