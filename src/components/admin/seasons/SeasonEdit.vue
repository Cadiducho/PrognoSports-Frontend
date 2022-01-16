<template>
    <div id="seasonEdit" class="box">
        <PrognoPageTitle class="mb-5" name="Administración de temporadas" />

        <section v-if="isAdmin(currentUser.rank)">

            <loading v-if="isLoading" />
            <template v-else>

                <div class="block">
                    <b-button type="is-link" to="/admin/seasons" tag="router-link">Lista de temporada</b-button>
                </div>

                <p v-if="!thereIsSeason">La temporada {{ seasonId }} no ha sido encontrada</p>
                <template v-else>

                    <h2 class="title">Datos de la temporada</h2>

                    <b-field label="Nombre de la temporada">
                        <b-input v-model="season.name" name="name" expanded lazy></b-input>
                    </b-field>

                    <b-field label="Número de eventos">
                        <b-input v-model="season.totalEvents" name="longitude" expanded lazy type="number" step="any"></b-input>
                    </b-field>

                    <b-field label="Competición">
                        <b-select v-model="season.competition.id" placeholder="Selecciona una competición" expanded>
                            <option
                                v-for="comp in competitions"
                                :value="comp.id"
                                :key="comp.id">
                                {{ comp.name }} ({{ comp.code }}) - {{ comp.fullname }}
                            </option>
                        </b-select>
                    </b-field>

                    <b-field>
                        <p class="control">
                            <b-button :disabled="!isDataOk()" label="Editar temporada" @click="editSeason()" type="is-primary" />
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
import {competitionService, seasonService} from "@/_services";
import {Season} from "@/types/Season";
import {Competition} from "@/types/Competition";
const Auth = namespace('Auth')

@Component({
        components: {
            AlertNoPermission,
            PrognoPageTitle,
        }
    }
)
export default class SeasonEdit extends Vue {
    @Auth.State("user") private currentUser!: User;

    private isLoading = true;
    private thereIsSeason = false;
    private season?: Season;
    private seasonId = this.$route.params.season;

    private competitions: Array<Competition> = [];

    private isDataOk(): boolean {
        return (this.season !== undefined) && !(this.season.id == undefined && this.season.name == undefined && this.season.competition!.id == undefined)
    }

    private editSeason(): void {
        let data = {
            competition: this.season!.competition.id,
            name: this.season!.name,
            totalEvents: this.season!.totalEvents
        }
        seasonService.editSeason(this.season!, data).then((result) => {
            this.$buefy.toast.open({
                message: "Se ha editado correctamente la temporada `" + result.name + "`",
                type: "is-success",
            });

            this.$router.push({
                name: 'adminSeasons'
            })
        }).catch((error) => {
            this.$buefy.toast.open({
                message: error.message,
                type: "is-danger",
            });
        });
    }

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
    }

}
</script>