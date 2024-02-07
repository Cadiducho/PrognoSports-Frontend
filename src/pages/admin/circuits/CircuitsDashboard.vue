<template>
    <div id="adminDrivers" class="box">
        <PrognoPageTitle class="mb-5" name="Administración de circuitos"/>

        <p-button class="mb-4" label="Nuevo circuito" color="info" :to="{name: 'circuitCreate'}" />

        <p-table :columns="columns" :rows="circuits"
                 hasViewButton hasEditButton hasDeleteButton paginated
                 :with-filter="filteredCircuits"
                 @view="goToView($event)"
                 @edit="goToEdit($event)"
                 @delete="confirmDeleteCircuit($event)"
        >

        </p-table>

        <PrognoModal v-show="showConfirmDeleteModal" @close="showConfirmDeleteModal = false">
            <template v-slot:title>
                Confirmar eliminación
            </template>
            <template v-slot:content>
                ¿Está seguro que desea eliminar el circuito <strong>{{circuitToDelete?.name}}</strong>? Esta acción no se puede deshacer.
            </template>
            <template v-slot:footer>
                <button class="button is-danger" @click="deleteCircuit(circuitToDelete)">Eliminar</button>
                <button class="button" @click="showConfirmDeleteModal = false">Cancelar</button>
            </template>
        </PrognoModal>

    </div>
</template>

<script lang="ts">
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import {circuitService, notificationService} from "@/_services";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import {Circuit} from "@/types/Circuit";
import PTable from "@/components/lib/table/PTable.vue";
import PrognoModal from "@/components/lib/PrognoModal.vue";
import PButton from "@/components/lib/forms/PButton.vue";

export default defineComponent({
    name: "CompetitionsDashboard",
    components: {
        PButton,
        PrognoModal,
        PTable,
        AlertNoPermission,
        PrognoPageTitle,
    },
    setup() {
        const authStore = useAuthStore();

        const currentUser = authStore.loggedUser;
        return { currentUser };
    },
    data() {
        return {
            filtroCircuit: '',
            columns: [
                {label: 'ID', field: 'id'},
                {label: 'Nombre', field: 'name'},
                {label: 'Localidad', field: 'locality'},
            ],
            circuits: new Array<Circuit>(),
            showConfirmDeleteModal: false,
            circuitToDelete: undefined as Circuit | undefined,

            filteredCircuits(original: Array<Circuit>, filter: string): Array<Circuit> {
                return original.filter((competition) => {
                    return (
                        competition.id
                            .toString()
                            .includes(filter) ||
                        competition.name
                            .toLowerCase()
                            .includes(filter) ||
                        competition.locality
                            .toLowerCase()
                            .includes(filter) ||
                        competition.country
                            .toLowerCase()
                            .includes(filter)
                    );
                });
            }
        }
    },
    mounted() {
        circuitService.getCircuitList().then((circuits) => {
            this.circuits = [];
            this.circuits.push(...circuits);
        })
    },
    methods: {
        goToView(circuit: Circuit) {
            this.$router.push({name: 'circuitDetails', params: {circuit: circuit.id}});
        },
        goToEdit(circuit: Circuit) {
            this.$router.push({name: 'adminCircuitEdit', params: {circuit: circuit.id}});
        },
        confirmDeleteCircuit(circuit: Circuit) {
            this.circuitToDelete = circuit;
            this.showConfirmDeleteModal = true;
        },
        deleteCircuit(circuit: Circuit) {
            circuitService.deleteCircuit(circuit).then((ok) => {

                // Elimino de la lista y por lo tanto de la tabla
                this.circuits.splice(this.circuits.findIndex(s => s.id === circuit.id),1);

                notificationService.showNotification(`Se ha eliminado correctamente el circuito ${circuit.name} (#${circuit.id})`);
            }).catch((error) => {
                notificationService.showNotification(error.message, "error");
            }).finally(() => {
                this.showConfirmDeleteModal = false;
            });
        }
    },
});
</script>