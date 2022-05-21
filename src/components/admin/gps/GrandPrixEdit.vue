<template>
    <div id="adminDrivers" class="box">
        <PrognoPageTitle class="mb-5" name="Administración de Grandes Premios" />

        <section v-if="isAdmin(currentUser)">

            <loading v-if="isLoadingGrandPrix" />
            <template v-else>

                <div class="block">
                    <b-button type="is-link" to="/admin/gps" tag="router-link">Lista de grandes premios</b-button>
                </div>

                <p v-if="!thereIsGrandPrix">El Gran Premio {{ id }} no ha sido encontrado</p>
                <template v-else>

                    <h2 class="title">Datos del Gran Premio</h2>

                    <div class="columns">
                        <div class="column is-four-fifths">
                            <b-field label="Nombre">
                                <b-input v-model="grandPrix.name" name="name" expanded lazy></b-input>
                            </b-field>
                        </div>
                        <div class="column">
                            <b-field label="Gran Premio suspendido">
                                <b-switch
                                    class="mt-2"
                                    v-model="grandPrix.suspended"
                                    passive-type='is-success'
                                    type='is-danger'>
                                </b-switch> {{ grandPrix.suspended }}
                            </b-field>
                        </div>
                    </div>

                    <b-field label="Código del Gran Premio">
                        <b-input v-model="grandPrix.code" name="code" expanded lazy></b-input>
                    </b-field>

                    <b-field label="Circuito del Gran Premio">
                        <b-select v-model:class="grandPrix.circuit" placeholder="Selecciona un circuito" expanded>
                            <option
                                v-for="circuit in circuitList"
                                :value="circuit"
                                :key="circuit.id + '-' + circuit.variant.name">
                                {{ circuit.nameWithVariant() }}
                            </option>
                        </b-select>
                    </b-field>

                    <div class="columns">
                        <div class="column">
                            <b-field label="Ronda del Gran Premio">
                                <b-input v-model="grandPrix.round" name="round" expanded lazy :min=0 type="number"></b-input>
                            </b-field>
                        </div>
                        <div class="column">
                            <b-field label="Vueltas del Gran Premio">
                                <b-input v-model="grandPrix.laps" name="laps" expanded lazy :min=0 type="number"></b-input>
                            </b-field>
                        </div>
                    </div>

                    <b-field label="Imagen promocional del Gran Premio">
                        <b-input v-model="grandPrix.promo_image_url" name="promo_image_url" expanded lazy></b-input>
                    </b-field>

                    <hr />
                    <b-field>
                        <p class="control">
                            <b-button :disabled="!isDataOk()" label="Editar gran premio" @click="editGrandPrix()" type="is-primary" />
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
import {
    circuitService,
    communityService,
    competitionService,
    driversService,
    grandPrixService,
    scoreService, seasonService
} from "@/_services";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";
import {marked} from "marked";
import {GrandPrix} from "@/types/GrandPrix";
import EventBus from "@/plugins/eventbus";
import dayjs from "dayjs";
import {Circuit} from "@/types/Circuit";
import {CircuitVariant} from "@/types/CircuitVariant";
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

    private competition: Competition = { code: this.$route.params.competition } as Competition;
    private season: Season = {name: this.$route.params.season } as Season;
    private id: string = this.$route.params.id;

    private grandPrix?: GrandPrix;
    private thereIsGrandPrix: boolean = false;
    private isLoadingGrandPrix: boolean = true;

    private circuitList: Array<Circuit> = [];
    private seasonList: Array<Season> = [];

    private isDataOk(): boolean {
        return !(this.grandPrix!.id == undefined
            && this.grandPrix!.code == undefined
            && this.grandPrix!.name == undefined
            && this.grandPrix!.circuit!.id == undefined
            && this.grandPrix!.laps == undefined
            && this.grandPrix!.promo_image_url == undefined
            && this.grandPrix!.round == undefined
            && this.grandPrix!.season!.id == undefined
        )
    }

    mounted() {
        grandPrixService.getGrandPrix(this.competition, this.season, this.id)
            .then(gp => {
                this.grandPrix = gp;
                this.thereIsGrandPrix = true;

                circuitService.getCircuitList().then((list) => {
                    this.circuitList = [];
                    this.circuitList.push(...new Set(list));
                });
                seasonService.getSeasonList().then((list) => {
                    this.seasonList = [];
                    this.seasonList.push(...list);
                });
                this.competition = gp.competition;
                this.season = gp.season;
            }).finally(() => {
                this.isLoadingGrandPrix = false;
            });
    }

    private editGrandPrix(): void {
        let data = {
            id: this.grandPrix!.id,
            season: this.season.id,
            competition: this.competition.id,
            round: this.grandPrix!.round,
            name: this.grandPrix!.name,
            code: this.grandPrix!.code,
            circuit: this.grandPrix!.circuit.id,
            variant: this.grandPrix!.circuit.variant.name,
            promo_image_url: this.grandPrix!.promo_image_url,
            laps: this.grandPrix!.laps,
            suspended: this.grandPrix!.suspended
        };

        grandPrixService.editGrandPrix(data).then((result) => {
            this.$buefy.toast.open({
                message: "Se ha editado correctamente el gran premio `" + result.name + "`",
                type: "is-success",
            });

            this.$router.push({
                name: 'adminGps'
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