<template>
    <div id="seasonEdit" class="box">
        <PrognoPageTitle class="mb-5" name="Administración de temporadas"/>

        <loading v-if="isLoading"/>
        <template v-else>

            <div class="block">
                <o-button variant="link" to="/admin/seasons" tag="router-link">Lista de temporadas</o-button>
            </div>

            <p v-if="!thereIsSeason">La temporada {{ seasonId }} no ha sido encontrada</p>
            <template v-else>

                <h2 class="title">Temporada {{ season.name }}</h2>
                <div class="columns">
                    <div class="column is-one-quarter">
                        <h3 class="subtitle">Datos de la temporada</h3>

                        <o-field label="Nombre de la temporada">
                            <o-input v-model="season.name" name="name" expanded lazy></o-input>
                        </o-field>

                        <o-field label="Número de eventos">
                            <o-input v-model="season.totalEvents" name="longitude" expanded lazy type="number" step="any"></o-input>
                        </o-field>

                        <o-field label="Competición">
                            <o-select v-model="season.competition.id" placeholder="Selecciona una competición" expanded>
                                <option
                                    v-for="comp in competitions"
                                    :value="comp.id"
                                    :key="comp.id">
                                    {{ comp.name }} ({{ comp.code }}) - {{ comp.fullname }}
                                </option>
                            </o-select>
                        </o-field>

                        <o-field>
                            <p class="control">
                                <o-button :disabled="!isDataOk()" label="Editar temporada" @click="editSeason()" variant="primary"/>
                            </p>
                        </o-field>
                    </div>

                    <div class="column">
                        <router-link class="box notification is-link has-text-centered has-text-weight-bold" :to="{name: 'adminGpsInSeason'}">
                            Grandes Premios en la temporada {{ season.name }}
                        </router-link>
                        <router-link class="box notification is-link has-text-centered has-text-weight-bold" to="/admin/competitions">
                            Equipos en la temporada {{ season.name }}
                        </router-link>
                        <router-link class="box notification is-link has-text-centered has-text-weight-bold" to="/admin/competitions">
                            Pilotos en la temporada {{ season.name }}
                        </router-link>
                    </div>
                </div>


            </template>
        </template>

    </div>
</template>

<script lang="ts">
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import {competitionService, notificationService, seasonService} from "@/_services";
import {Season} from "@/types/Season";
import {Competition} from "@/types/Competition";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";

export default defineComponent({
    name: "EditSeason",
    components: {
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
            isLoading: true,
            thereIsSeason: false,
            season: {} as Season,
            seasonId: this.$route.params.season,

            competitions: new Array<Competition>()
        }
    },
    mounted() {
        seasonService.getSeason(this.seasonId).then((season) => {
            this.season = season;
            this.thereIsSeason = true;
        }).finally(() => {
            this.isLoading = false;
        })

        competitionService.getCompetitionList().then((list) => {
            this.competitions = [];
            this.competitions.push(...list);
        })
    },
    methods: {
        isDataOk(): boolean {
            return (this.season !== undefined) && !(this.season.id == undefined && this.season.name == undefined && this.season.competition!.id == undefined)
        },
        editSeason(): void {
            let data = {
                competition: this.season!.competition.id,
                name: this.season!.name,
                totalEvents: this.season!.totalEvents
            }
            seasonService.editSeason(this.season!, data).then((result) => {
                notificationService.showNotification("Se ha editado correctamente la temporada `" + result.name + "`");

                this.$router.push({
                    name: 'adminSeasons'
                })
            }).catch((error) => {
                notificationService.showNotification(error.message, "error");
            });
        }
    }
});
</script>