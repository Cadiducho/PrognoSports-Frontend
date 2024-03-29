<template>
    <div id="adminGps" class="box">
        <PTitle class="mb-5" name="Administración de Grandes Premios en la temporada" />

        <nav class="block is-flex is-justify-content-space-between">
            <p class="control">
                <o-button variant="primary" :to="{name: 'adminGps'}" tag="router-link" class="mr-2">Volver a lista de Grandes Premios</o-button>
                <o-button variant="link" :to="{name: 'gpCreate'}" tag="router-link">Añadir Gran Premio a la temporada</o-button>
            </p>
            <o-select v-if="seasonList" v-model="chosenSeason" placeholder="Selecciona la temporada" @change="changeSeason()">
                <option
                    v-for="season in seasonList"
                    :value="season"
                    :key="season.id">
                    {{ season.name }} (#{{ season.id }}) - {{ season.competition.name }}
                </option>
            </o-select>
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


        <o-table :data="filteredGps"
                 hoverable striped
                 paginated
                 per-page="10">

            <o-table-column field="round" label="Round" width="40" sortable v-slot="props">
                #{{ props.row.round }}
            </o-table-column>

            <o-table-column field="name" label="Name" sortable v-slot="props">
                {{ props.row.name }}
            </o-table-column>

            <o-table-column field="season" label="Season" sortable v-slot="props">
                {{ props.row.season.name }}
            </o-table-column>

            <o-table-column field="code" label="Code" sortable v-slot="props">
                {{ props.row.code }}
            </o-table-column>

            <o-table-column field="laps" label="Laps" width="40" sortable v-slot="props">
                {{ props.row.laps }}
            </o-table-column>

            <o-table-column field="circuit" label="Circuit" sortable v-slot="props">
                {{ props.row.circuit.name }}
                <span v-if="!props.row.variant.isDefault()"
                      class="tag is-info">
                    {{ props.row.variant.name }}
                </span>
            </o-table-column>

            <o-table-column field="sessions" label="Sessions" v-slot="props">
                <div class="tags are-small">
                        <span class="tag is-danger" v-if="!props.row.sessions.length">
                            No hay sesiones
                        </span>
                    <span class="tag is-success" v-for="ses in props.row.sessions">
                            {{ ses.name }}
                        </span>
                </div>
            </o-table-column>

            <o-table-column label="Actions" v-slot="props">
                    <span class="tags">
                        <router-link class="tag is-info" :to="{name: 'gpdetails', params: {season: props.row.season.id, competition: props.row.competition.id, gp: props.row.id}}">Ver</router-link>
                        <router-link class="tag is-warning" :to="{name: 'adminGpEditInSeason', params: {gp: props.row.id}}">Editar</router-link>
                        <span class="tag is-danger" @click="confirmDeleteGrandPrix(props.row)">Eliminar</span>
                    </span>
            </o-table-column>

        </o-table>

        <PrognoModal v-show="isDeleteGPModalActive" @close="isDeleteGPModalActive = false" @handle="deleteGrandPrixFromSeason(grandPrixToDelete)">
            <template v-slot:title>¿Eliminar Grand Prix de esta competición?</template>
            <template v-slot:content>
                ¿Estás seguro de que quieres <b>eliminar</b> el Gran Premio <span class="has-text-weight-semibold">{{ grandPrixToDelete.name }} {{grandPrixToDelete.season?.name }}</span> de esta competición? <br/>Esta acción se puede deshacer.
            </template>
            <template v-slot:saveText>Eliminar Grand Prix</template>
        </PrognoModal>
    </div>
</template>

<script lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import {grandPrixService, seasonService} from "@/_services";
import {GrandPrix} from "@/types/GrandPrix";
import {Season} from "@/types/Season";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import PrognoModal from "@/components/lib/PrognoModal.vue";

export default defineComponent({
    name: "GrandPrixListInSeason",
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
            season: {id: Number(this.$route.params.season)} as Season,

            filtroGrandprix: '',
            gps: new Array<GrandPrix>(),
            seasonList: new Array<Season>(),
            chosenSeason: {} as Season,

            isDeleteGPModalActive: false,
            grandPrixToDelete: {} as GrandPrix
        }
    },
    mounted() {
        this.loadGrandPrixes(this.season);

        seasonService.getSeasonList().then((seasons) => {
            this.seasonList = [];
            this.seasonList.push(...seasons);
            this.chosenSeason = this.seasonList.find((s) => s.id === this.season.id)!;
        });
    },
    methods: {
        loadGrandPrixes(season: Season) {
            grandPrixService.getGrandPrixesList(season)
                .then((gpsList) => {
                    this.gps = [];
                    this.gps.push(...gpsList);
                })
        },
        changeSeason() {
            this.loadGrandPrixes(this.chosenSeason!);
        },
        confirmDeleteGrandPrix(gp: GrandPrix) {
            this.isDeleteGPModalActive = true;
            this.grandPrixToDelete = gp;
        },
        deleteGrandPrixFromSeason(gp: GrandPrix) {
            console.log("deleteGrandPrixFromSeason", gp);
            /*
                    grandPrixService.deleteGranPrix(gp).then((ok) => {

                        // Elimino de la lista y por lo tanto de la tabla
                        this.gps.splice(this.gps.findIndex(s => s.id === gp.id),1);

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
                        .includes(filtroLowerCase) ||
                    gp.circuit.name
                        .toLowerCase()
                        .includes(filtroLowerCase) ||
                    gp.circuit.locality
                        .toLowerCase()
                        .includes(filtroLowerCase) ||
                    gp.circuit.country
                        .toLowerCase()
                        .includes(filtroLowerCase)
                );
            });
        }
    }
});
</script>