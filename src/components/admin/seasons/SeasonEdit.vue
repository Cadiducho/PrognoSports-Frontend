<template>
    <div id="seasonEdit" class="box">
        <PrognoPageTitle class="mb-5" name="Administración de temporadas" />

        <section v-if="isAdmin(currentUser)">

            <loading v-if="isLoading" />
            <template v-else>

                <div class="block">
                    <o-button variant="link" to="/admin/seasons" tag="router-link">Lista de temporada</o-button>
                </div>

                <p v-if="!thereIsSeason">La temporada {{ seasonId }} no ha sido encontrada</p>
                <template v-else>

                    <h2 class="title">Datos de la temporada</h2>

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
                            <o-button :disabled="!isDataOk()" label="Editar temporada" @click="editSeason()" variant="primary" />
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
            this.$oruga.notification.open({
                message: "Se ha editado correctamente la temporada `" + result.name + "`",
                variant: "success",
            });

            this.$router.push({
                name: 'adminSeasons'
            })
        }).catch((error) => {
            this.$oruga.notification.open({
                message: error.message,
                variant: "danger",
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