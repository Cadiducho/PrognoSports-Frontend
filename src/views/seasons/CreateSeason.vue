<template>
    <div id="createSeason" class="box">
        <PrognoPageTitle class="mb-5" name="Crear temporada" />

        <section v-if="isAdmin(currentUser.rank)">
            <b-steps v-model="activeStep">
                <b-step-item step="1" label="Datos de la temporada">
                    <h2 class="title">Datos de la temporada</h2>

                    <b-field label="Nombre de la temporada">
                        <b-input v-model="createdSeason.name" name="name" expanded lazy></b-input>
                    </b-field>

                    <b-field label="Número de eventos">
                        <b-input v-model="createdSeason.totalEvents" name="longitude" expanded lazy type="number" step="any"></b-input>
                    </b-field>

                    <b-field label="Competición">
                        <b-select v-model:class="createdSeason.competition" placeholder="Selecciona una competición" expanded>
                            <option
                                v-for="comp in competitions"
                                :value="comp"
                                :key="comp.id">
                                {{ comp.name }} ({{ comp.code }}) - {{ comp.fullname }}
                            </option>
                        </b-select>
                    </b-field>

                    <hr/>

                </b-step-item>

                <b-step-item step="2" label="Finalizar">
                    <h2 class="title">Finalizar</h2>

                    <AlertInvalidData :object="createdSeason.name" message="No has introducido nombre para esta temporada" />
                    <AlertInvalidData :object="createdSeason.totalEvents" message="No has introducido número de eventos para esta temporada" />
                    <AlertInvalidData :object="createdSeason.competition" message="No has introducido competición para esta temporada" />

                    <div class="notification has-background-primary">
                        Revisa los datos, se va a crear la siguiente temporada
                    </div>

                    <div class="content">
                        <p class="card-text"><b>Nombre de la temporada: </b>{{ createdSeason.name }}</p>
                        <p class="card-text"><b>Eventos de la temporada: </b>{{ createdSeason.totalEvents }}</p>
                        <p class="card-text" v-if="createdSeason.competition"><b>Competición: </b>{{ createdSeason.competition.name}}</p>
                    </div>

                    <hr/>
                    <b-field>
                        <p class="control">
                            <b-button :disabled="!isDataOk()" label="Crear temporada" @click="registerSeason()" type="is-primary" />
                        </p>
                    </b-field>
                </b-step-item>
            </b-steps>
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
import {competitionService, seasonService} from "@/_services";
import AlertInvalidData from "@/components/lib/AlertInvalidData.vue";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import {Season} from "@/types/Season";
import {Competition} from "@/types/Competition";
const Auth = namespace('Auth')

@Component({
        components: {
            AlertNoPermission,
            AlertInvalidData,
            PrognoPageTitle,
        }
    }
)
export default class CreateSeason extends Vue {
    @Auth.State("user") private currentUser!: User;

    private activeStep = 0;
    private competitions: Array<Competition> = [];

    private createdSeason: Season = {
        id: undefined!,
        competition: undefined!,
        name: undefined!,
        totalEvents: undefined!
    }

    mounted() {
        competitionService.getCompetitionList().then((list) => {
            this.competitions = [];
            this.competitions.push(...list);
        })
    }

    private isDataOk(): boolean {
        return !(this.createdSeason.id == undefined && this.createdSeason.name == undefined && this.createdSeason.competition == undefined)
    }

    private registerSeason(): void {
        let rawSeason = {
            name: this.createdSeason.name,
            totalEvents: this.createdSeason.totalEvents,
            competition: this.createdSeason.competition.name,
        }

        seasonService.createSeason(rawSeason).then((result) => {
            this.$buefy.toast.open({
                message: "Se ha registrado correctamente la temporada `" + result.name + "`",
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
}
</script>