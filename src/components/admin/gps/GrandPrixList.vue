<template>
    <div id="adminGps" class="box">
        <PrognoPageTitle class="mb-5" name="Administración de Grandes Premios" />

        <section v-if="isAdmin(currentUser)">

            <nav class="block is-flex is-justify-content-space-between">
                <p class="control">
                    <o-button variant="link" to="/new/grandprix" tag="router-link">Nuevo Gran Premio</o-button>
                </p>
                <o-select v-if="seasonList" v-model="chosenSeason" placeholder="Selecciona la temporada"  @input="changeSeason()" >
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

            <o-switch v-model="isPaginated">Paginated</o-switch>

            <o-table :data="filteredGps"
                    hoverable striped
                     :paginated="isPaginated"
                     per-page="15">

                <o-table-column field="round" label="Round" width="40" sortable v-slot="props">
                    #{{ props.row.round }}
                </o-table-column>

                <o-table-column field="name" label="Name" sortable  v-slot="props">
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
                    <span v-if="hasVariant(props.row.circuit)"
                        class="tag is-info">
                        {{ props.row.circuit.variant.name }}
                    </span>
                </o-table-column>

                <o-table-column field="sessions" label="Sessions" v-slot="props">
                    <div class="tags are-small">
                        <span class="tag is-success" v-for="ses in props.row.sessions">
                            {{ ses.name }}
                        </span>
                    </div>
                </o-table-column>

                <o-table-column label="Actions" v-slot="props">
                    <span class="tags">
                        <router-link class="tag is-info" :to="`/gps/${getSlug(props.row)}`">Ver</router-link>
                        <router-link class="tag is-warning" :to="`/admin/gps/${getSlug(props.row)}`">Editar</router-link>
                        <span class="tag is-danger" @click="confirmDeleteGrandPrix(props.row)">Eliminar</span>
                    </span>
                </o-table-column>

            </o-table>

        </section>
        <section v-else>
            <AlertNoPermission />
        </section>
    </div>
</template>

<script lang="ts">
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import {grandPrixService, seasonService} from "@/_services";
import {Competition} from "@/types/Competition";
import {GrandPrix} from "@/types/GrandPrix";
import {Season} from "@/types/Season";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";

export default defineComponent({
    name: "GrandPrixList",
    components: {
        AlertNoPermission,
        PrognoPageTitle,
    },
    setup() {
        const authStore = useAuthStore();
        const communityStore = useCommunityStore();

        const currentUser = authStore.user;
        const currentCommunity = communityStore.community;
        return {currentUser, currentCommunity};
    },
    data() {
        return {
            isPaginated: true,
            filtroGrandprix: '',
            gps: new Array<GrandPrix>(),
            seasonList: new Array<Season>(),
            chosenSeason: {} as Season
        }
    },
    mounted() {
        this.loadGrandPrixes(this.currentCommunity.competition, this.currentCommunity.competition.currentSeason);

        seasonService.getSeasonList().then((seasons) => {
            this.seasonList = [];
            this.seasonList.push(...seasons);
        });
    },
    methods: {
        loadGrandPrixes(competition: Competition, season: Season) {
            grandPrixService.getGrandPrixesList(competition, season)
                .then((gpsList) => {
                    this.gps = [];
                    this.gps.push(...gpsList);
                })
        },
        changeSeason() {
            this.loadGrandPrixes(this.chosenSeason!.competition, this.chosenSeason!);
        },
        confirmDeleteGrandPrix(gp: GrandPrix) {
            this.$oruga.dialog.confirm({
                title: 'Eliminar gran premio',
                message: `¿Estás seguro de que quieres <b>eliminar</b> el Gran Premio ${gp.name} #${gp.season.name}? <br/>Esta acción se puede deshacer.`,
                confirmText: 'Eliminar gran premio',
                type: 'danger',
                hasIcon: true,
                onConfirm: () => this.deleteCompetition(gp),
            })
        },
        getSlug(gp: GrandPrix): string {
            return `${gp.competition.code}/${gp.season.name}/${gp.id}`;
        },
        deleteCompetition(gp: GrandPrix) {
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