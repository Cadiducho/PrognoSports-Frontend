<template>
    <div id="adminDrivers" class="box">
        <PTitle class="mb-5" name="Administración de competiciones"/>

        <div class="block">
            <o-button variant="link" :to="{name: 'competitionCreate'}" tag="router-link">Nueva competición</o-button>
        </div>

        <o-field>
            <o-input
                v-model="filtroCompetition"
                placeholder="Buscar competition"
                type="search"
                icon-pack="fas"
                icon="search"
            ></o-input>
        </o-field>

        <div class="block">
            <o-switch v-model="isPaginated">Paginated</o-switch>
        </div>

        <o-table :data="filteredCompetitions"
                 hoverable striped
                 :paginated="isPaginated"
                 per-page="15">

            <o-table-column field="id" label="ID" width="40" sortable numeric v-slot="props">
                {{ props.row.id }}
            </o-table-column>

            <o-table-column field="code" label="Code" sortable v-slot="props">
                {{ props.row.code }}
            </o-table-column>

            <o-table-column field="name" label="Name" sortable v-slot="props">
                {{ props.row.name }}
            </o-table-column>

            <o-table-column field="fullname" label="Full Name" sortable v-slot="props">
                {{ props.row.fullname }}
            </o-table-column>

            <o-table-column field="currentSeason.id" label="Temporada actual" sortable v-slot="props">
                <template v-if="props.row.currentSeason">
                    {{ props.row.currentSeason.name }} (#{{ props.row.currentSeason.id }})
                </template>
                <template v-else>
                    <span class="tag is-info">No establecida</span>
                </template>
            </o-table-column>

            <o-table-column label="Actions" v-slot="props">
                    <span class="tags">
                        <router-link class="tag is-warning" :to="'/admin/competitions/' + props.row.id">Editar</router-link>
                        <span class="tag is-danger" @click="confirmDeleteCompetition(props.row)">Eliminar</span>
                    </span>
            </o-table-column>

        </o-table>

        <PrognoModal v-show="isDeleteCompetitionModalActive" @close="isDeleteCompetitionModalActive = false" @handle="deleteCompetition(competitionToDelete)">
            <template v-slot:title>¿Borrar competición?</template>
            <template v-slot:content>
                ¿Estás seguro de que quieres <b>eliminar</b> la competición <span class="has-text-weight-semibold">{{ competitionToDelete.name }} (id: {{competitionToDelete.id}})? <br/>Esta acción se puede deshacer. </span>
            </template>
            <template v-slot:saveText>Borrar competición</template>
        </PrognoModal>

    </div>
</template>

<script lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import {competitionService, notificationService} from "@/_services";
import {Competition} from "@/types/Competition";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import PrognoModal from "@/components/lib/PrognoModal.vue";

export default defineComponent({
    name: "CompetitionsDashboard",
    components: {
        PrognoModal,
        AlertNoPermission,
        PTitle,
    },
    setup() {
        const authStore = useAuthStore();

        const currentUser = authStore.loggedUser;
        return { currentUser };
    },
    data() {
        return {
            isPaginated: true,
            filtroCompetition: '',
            competitions: new Array<Competition>(),

            isDeleteCompetitionModalActive: false,
            competitionToDelete: {} as Competition
        }
    },
    mounted() {
        competitionService.getCompetitionList().then((competitions) => {
            this.competitions = [];
            this.competitions.push(...competitions);
        })
    },
    computed: {
        filteredCompetitions(): Array<Competition> {
            if (!this.filtroCompetition.trim()) {
                return this.competitions;
            }

            const filtroLowerCase: string = this.filtroCompetition.toLowerCase().trim();

            return this.competitions.filter((competition) => {
                return (
                    competition.id
                        .toString()
                        .includes(filtroLowerCase) ||
                    competition.name
                        .toLowerCase()
                        .includes(filtroLowerCase) ||
                    competition.code
                        .toLowerCase()
                        .includes(filtroLowerCase) ||
                    competition.fullname
                        .toLowerCase()
                        .includes(filtroLowerCase)
                );
            });
        }
    },
    methods: {
        confirmDeleteCompetition(competition: Competition) {
            this.competitionToDelete = competition;
            this.isDeleteCompetitionModalActive = true;
        },
        deleteCompetition(competition: Competition) {
            competitionService.deleteCompetition(competition).then((ok) => {

                // Elimino de la lista y por lo tanto de la tabla
                this.competitions.splice(this.competitions.findIndex(s => s.id === competition.id),1);

                notificationService.showNotification(`Se ha eliminado correctamente la competition ${competition.name} (#${competition.id})`, "success");
            }).catch((error) => {
                notificationService.showNotification(error.message, "error");
            });
        }
    },
});
</script>