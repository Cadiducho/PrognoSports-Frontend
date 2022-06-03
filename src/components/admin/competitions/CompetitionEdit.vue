<template>
    <div id="adminDrivers" class="box">
        <PrognoPageTitle class="mb-5" name="Administración de competiciones" />

        <section v-if="isAdmin(currentUser)">

            <loading v-if="isLoading" />
            <template v-else>

                <div class="block">
                    <o-button variant="link" to="/admin/competitions" tag="router-link">Lista de competiciones</o-button>
                </div>

                <p v-if="!thereIsCompetition">La competición {{ competitionId }} no ha sido encontrada</p>
                <template v-else>

                    <h2 class="title">Datos de la competición</h2>

                    <o-field label="Nombre de la competición">
                        <o-input v-model="competition.name" name="name" expanded lazy></o-input>
                    </o-field>

                    <o-field label="Nombre completo y con patrocinadores">
                        <o-input v-model="competition.fullname" name="fullname" expanded lazy></o-input>
                    </o-field>

                    <o-field label="Código de la competición">
                        <o-input v-model="competition.code" name="code" expanded lazy></o-input>
                    </o-field>


                    <o-field label="Temporada actual">
                        <o-select v-model="competition.currentSeason.id" placeholder="Selecciona la temporada actual" expanded>
                            <option
                                v-for="season in compSeasons"
                                :value="season.id"
                                :key="season.id">
                                {{ season.name }} (#{{ season.id }})
                            </option>
                        </o-select>
                    </o-field>

                    <div class="columns">
                        <div class="column">
                            <o-field label="Reglas">
                                <o-input v-model="competition.rules" type="textarea"></o-input>
                            </o-field>
                        </div>
                        <div class="column content">
                            <div v-html="previewRules"></div>
                        </div>
                    </div>

                    <hr />
                    <o-field>
                        <p class="control">
                            <o-button :disabled="!isDataOk()" label="Editar competición" @click="editCompetition()" variant="primary" />
                        </p>
                    </o-field>
                </template>
            </template>

        </section>
        <section v-else>
            <AlertNoPermission />
        </section>
    </div>
</template>

<script lang="ts">
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import {competitionService} from "@/_services";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";
import {marked} from "marked";

import {defineComponent} from "vue";
import {useAuthStore} from "@/pinia/authStore";

export default defineComponent({
    name: "CompetitionEdit",
    components: {
        AlertNoPermission,
        PrognoPageTitle,
    },
    setup() {
        const authStore = useAuthStore();

        const currentUser = authStore.user;
        return { currentUser };
    },
    data() {
        return {
            isLoading: true,
            thereIsCompetition: false,
            competition: {} as Competition,
            competitionId: this.$route.params.competition,
            compSeasons: new Array<Season>(),
        }
    },
    mounted() {
        competitionService.getCompetition(this.competitionId).then((competition) => {
            this.competition = competition;
            this.thereIsCompetition = true;

            // Si no hay una temporada por defecto en la competición, pongo id 0 para poder renderizar el selector con v-model=currentSeason
            if (!this.competition.currentSeason) {
                this.competition.currentSeason = {id: 0} as Season
            }

            competitionService.getSeasonsOfCompetition(this.competition).then((ses) => {
                this.compSeasons = [];
                this.compSeasons.push(...ses);
            })
        }).finally(() => {
            this.isLoading = false;
        })
    },
    methods: {
        isDataOk(): boolean {
            return (this.competition !== undefined)
                && !(this.competition.id == undefined
                    && this.competition.code == undefined
                    && this.competition.name == undefined
                    && this.competition.rules == undefined
                    && this.competition.fullname == undefined)
        },
        editCompetition(): void {
            let data = {
                code: this.competition!.code,
                name: this.competition!.name,
                fullname: this.competition!.fullname,
                rules: this.competition!.rules,
                currentSeason: this.competition!.currentSeason!.id,
            }
            competitionService.editCompetition(this.competition!, data).then((result) => {
                this.$oruga.notification.open({
                    message: "Se ha editado correctamente la competición `" + result.name + "`",
                    variant: "success",
                });

                this.$router.push({
                    name: 'adminCompetitions'
                })
            }).catch((error) => {
                this.$oruga.notification.open({
                    message: error.message,
                    variant: "danger",
                });
            });
        }
    },
    computed: {
        previewRules() {
            return marked(this.competition?.rules ?? "");
        }
    }
});
</script>