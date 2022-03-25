<template>
    <div id="adminDrivers" class="box">
        <PrognoPageTitle class="mb-5" name="Administración de Grandes Premios" />

        <section v-if="isAdmin(currentUser)">

            <loading v-if="isLoadingGrandPrix" />
            <template v-else>

                <div class="block">
                    <b-button type="is-link" to="/admin/gps" tag="router-link">Lista de grandes premios</b-button>
                </div>

                <p v-if="!thereIsGrandPrix">El Gran Premio {{ grandprixId }} no ha sido encontrado</p>
                <template v-else>

                    <h2 class="title">Datos del Gran Premio</h2>

                    <b-field label="Nombre">
                        <b-input v-model="grandPrix.name" name="name" expanded lazy></b-input>
                    </b-field>

                    <b-field label="Código de la competición">
                        <b-input v-model="grandPrix.code" name="code" expanded lazy></b-input>
                    </b-field>

                    <b-field label="Ronda">
                        <b-input v-model="grandPrix.round" name="round" type="number" min="1" expanded lazy></b-input>
                    </b-field>

                    <b-field label="Promo URL">
                        <b-input v-model="grandPrix.promo_image_url" name="promo_image_url" expanded lazy></b-input>
                    </b-field>

                    <b-field label="Circuito" grouped>
                        <b-select v-model="grandPrix.circuit.id" placeholder="Selecciona el circuito" expanded @input="changeCircuit()">
                            <option
                                v-for="circuit in circuitList"
                                :value="circuit.id"
                                :key="circuit.id">
                                {{ circuit.name }}
                            </option>
                        </b-select>
                        <b-select v-model="grandPrix.circuit.variant.name" placeholder="Selecciona la variante" expanded>
                            <option
                                v-for="variant in variantsList"
                                :value="variant.name"
                                :key="variant.name">
                                {{ variant.name }}
                            </option>
                        </b-select>
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
    scoreService
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
    private variantsList: Array<CircuitVariant> = [];

    private isDataOk(): boolean {
        return (this.competition !== undefined)
            && !(this.competition.id == undefined
                && this.competition.code == undefined
                && this.competition.name == undefined
                && this.competition.rules == undefined
                && this.competition.fullname == undefined)
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
                circuitService.listCircuitVariant(gp.circuit).then((list) => {
                    this.variantsList = [];
                    this.variantsList.push(...list);
                })
            }).finally(() => {
                this.isLoadingGrandPrix = false;
            });
    }

    private changeCircuit() {
        circuitService.listCircuitVariant(this.grandPrix!.circuit).then((list) => {
            this.variantsList = [];
            this.variantsList.push(...list);
        })
    }

    private editGrandPrix(): void {
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