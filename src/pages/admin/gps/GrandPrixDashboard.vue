<template>
    <div id="adminGps" class="box">
        <PTitle class="mb-5" name="Administración de Grandes Premios" />

        <nav class="block is-flex is-justify-content-space-between">
            <p class="control">
                <o-button variant="link" :to="{name: 'gpCreate'}" tag="router-link">Nuevo Gran Premio</o-button>
            </p>

            <section class="is-flex">
                <o-button v-if="chosenSeason.id" variant="success"
                          :to="{name: 'adminGpsInSeason', params: {season: chosenSeason.id}}"
                          tag="router-link" class="mr-2">
                    Ir a temporada actual
                </o-button>
                <o-select v-if="seasonList" v-model="chosenSeason" placeholder="Selecciona la temporada" @change="goToSeason()">
                    <option
                        v-for="season in seasonList"
                        :value="season"
                        :key="season.id">
                        {{ season.name }} (#{{ season.id }}) - {{ season.competition.name }}
                    </option>
                </o-select>
            </section>
        </nav>


        <o-field class="block">
            <o-input
                v-model="filtroGrandprix"
                placeholder="Buscar gran premio"
                type="search"
                icon-pack="fas"
                icon="search"
            ></o-input>
        </o-field>

        <o-table :data="filteredGps" paginated :per-page="10"
                 hoverable striped>

            <o-table-column field="id" label="ID" sortable v-slot="props">
                {{ props.row.id }}
            </o-table-column>

            <o-table-column field="name" label="Name" sortable v-slot="props">
                {{ props.row.name }}
            </o-table-column>

            <o-table-column field="code" label="Code" sortable v-slot="props">
                {{ props.row.code }}
            </o-table-column>

            <o-table-column label="Actions" v-slot="props">
                    <span class="tags">
                        <router-link class="tag is-warning" :to="{name: 'adminGpEdit', params: {gp: props.row.id}}">Editar</router-link>
                        <span class="tag is-danger" @click="confirmDeleteGrandPrix(props.row)">Eliminar</span>
                    </span>
            </o-table-column>

        </o-table>
    </div>
    <PrognoModal v-show="isDeleteGrandPrixModalActive" @close="isDeleteGrandPrixModalActive = false" @handle="deleteGrandPrix(grandPrixToDelete)">
        <template v-slot:title>¿Borrar Gran Premio?</template>
        <template v-slot:content>
            Estás seguro de que deseas borrar el Gran Premio <span class="has-text-weight-semibold">{{ grandPrixToDelete.name }}</span>?
        </template>
        <template v-slot:saveText>Borrar Gran Premio</template>
    </PrognoModal>
</template>

<script lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import PrognoModal from "@/components/lib/PrognoModal.vue";
import {grandPrixService, notificationService, seasonService} from "@/_services";
import {GrandPrix} from "@/types/GrandPrix";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import {Season} from "@/types/Season";

export default defineComponent({
    name: "GrandPrixDashboard",
    components: {
        PrognoModal,
        AlertNoPermission,
        PTitle,
    },
    setup() {
        const authStore = useAuthStore();
        const communityStore = useCommunityStore();

        const currentUser = authStore.loggedUser;
        const currentCommunity = communityStore.currentCommunity;
        return {currentUser, currentCommunity};
    },
    data() {
        return {
            filtroGrandprix: '',
            gps: new Array<GrandPrix>(),
            seasonList: new Array<Season>(),
            chosenSeason: {} as Season,

            isDeleteGrandPrixModalActive: false,
            grandPrixToDelete: {} as GrandPrix
        }
    },
    mounted() {
        grandPrixService.getAllGrandPrixes().then(gpsList => {
            this.gps = [];
            this.gps.push(...gpsList);
        });
        seasonService.getSeasonList().then((seasons) => {
            this.seasonList = [];
            this.seasonList.push(...seasons);
            this.chosenSeason = this.seasonList[this.seasonList.length - 1];
        });
    },
    methods: {
        goToSeason() {
            this.$router.push({
                name: 'adminGpsInSeason',
                params: {
                    season: this.chosenSeason.id,
                }
            });
        },
        confirmDeleteGrandPrix(gp: GrandPrix) {
            this.grandPrixToDelete = gp;
            this.isDeleteGrandPrixModalActive = true;
        },
        deleteGrandPrix(gp: GrandPrix) {
            this.isDeleteGrandPrixModalActive = false;

            grandPrixService.deleteGrandPrix(gp).then(() => {
                notificationService.showNotification(`Se ha eliminado correctamente el gran premio ${gp.name}`);
                this.gps.splice(this.gps.findIndex(s => s.id === gp.id), 1);
            }).catch(() => {
                notificationService.showNotification(`No se ha podido eliminar el gran premio ${gp.name}`, "error");
            });
        }
    },
    computed: {
        filteredGps(): Array<GrandPrix> {
            if (!this.filtroGrandprix.trim()) {
                return this.gps;
            }

            const filtroLowerCase: string = this.filtroGrandprix.toLowerCase().trim();

            return this.gps.filter((gp) => {
                return (
                    gp.id
                        .toString()
                        .includes(filtroLowerCase) ||
                    gp.name
                        .toLowerCase()
                        .includes(filtroLowerCase) ||
                    gp.code
                        .toLowerCase()
                        .includes(filtroLowerCase)
                );
            });
        }
    }
});
</script>