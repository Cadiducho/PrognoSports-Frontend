<template>
    <div id="adminDrivers" class="box">
        <PrognoPageTitle class="mb-5" name="Administración de competiciones" />

        <section v-if="isAdmin(currentUser.rank)">

            <loading v-if="isLoading" />
            <template v-else>

                <div class="block">
                    <b-button type="is-link" to="/admin/competitions" tag="router-link">Lista de competiciones</b-button>
                </div>

                <p v-if="!thereIsCompetition">La competición {{ competitionId }} no ha sido encontrada</p>
                <template v-else>

                    <h2 class="title">Datos de la competición</h2>

                    <b-field label="Nombre de la competición">
                        <b-input v-model="competition.name" name="name" expanded lazy></b-input>
                    </b-field>

                    <b-field label="Nombre completo y con patrocinadores">
                        <b-input v-model="competition.fullname" name="fullname" expanded lazy></b-input>
                    </b-field>

                    <b-field label="Código de la competición">
                        <b-input v-model="competition.code" name="code" expanded lazy></b-input>
                    </b-field>


                    <b-field label="Temporada actual">
                        <b-select v-model="competition.currentSeason.id" placeholder="Selecciona la temporada acutal" expanded>
                            <option
                                v-for="season in compSeasons"
                                :value="season.id"
                                :key="season.id">
                                {{ season.name }} (#{{ season.id }})
                            </option>
                        </b-select>
                    </b-field>

                    <div class="columns">
                        <div class="column">
                            <b-field label="Reglas">
                                <b-input v-model="competition.rules" type="textarea"></b-input>
                            </b-field>
                        </div>
                        <div class="column content">
                            <div v-html="previewRules"></div>
                        </div>
                    </div>

                    <hr />
                    <b-field>
                        <p class="control">
                            <b-button :disabled="!isDataOk()" label="Editar competición" @click="editCompetition()" type="is-primary" />
                        </p>
                    </b-field>
                </template>
            </template>

        </section>
        <section v-else>
            <AlertNoPermission />
        </section>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import {User} from "@/types/User";
import {namespace} from "vuex-class";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import {competitionService} from "@/_services";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";
import {marked} from "marked";
const Auth = namespace('Auth')

@Component({
        components: {
            AlertNoPermission,
            PrognoPageTitle,
        }
    }
)
export default class CompetitionEdit extends Vue {
    @Auth.State("user") private currentUser!: User;

    private isLoading = true;
    private thereIsCompetition = false;
    private competition?: Competition;
    private competitionId = this.$route.params.competition;

    private compSeasons: Array<Season> = [];

    private isDataOk(): boolean {
        return (this.competition !== undefined)
            && !(this.competition.id == undefined
                && this.competition.code == undefined
                && this.competition.name == undefined
                && this.competition.rules == undefined
                && this.competition.fullname == undefined)
    }

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
    }

    get previewRules() {
        return marked(this.competition?.rules ?? "");
    }

    private editCompetition(): void {
        let data = {
            code: this.competition!.code,
            name: this.competition!.name,
            fullname: this.competition!.fullname,
            rules: this.competition!.rules,
            currentSeason: this.competition!.currentSeason!.id,
        }
        competitionService.editCompetition(this.competition!, data).then((result) => {
            this.$buefy.toast.open({
                message: "Se ha editado correctamente la competición `" + result.name + "`",
                type: "is-success",
            });

            this.$router.push({
                name: 'adminCompetitions'
            })
        }).catch((error) => {
            this.$buefy.toast.open({
                message: error.message,
                type: "is-danger",
            });
        });
    }

}
</script>