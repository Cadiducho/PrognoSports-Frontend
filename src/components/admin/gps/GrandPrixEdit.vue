<template>
    <div id="adminDrivers" class="box">
        <PrognoPageTitle class="mb-5" name="Administración de Grandes Premios" />

        <section v-if="isAdmin(currentUser)">

            <loading v-if="isLoadingGrandPrix" />
            <template v-else>

                <div class="block">
                    <o-button variant="link" to="/admin/gps" tag="router-link">Lista de grandes premios</o-button>
                </div>

                <p v-if="!thereIsGrandPrix">El Gran Premio {{ id }} no ha sido encontrado</p>
                <template v-else>

                    <h2 class="title">Datos del Gran Premio</h2>

                    <div class="columns">
                        <div class="column is-four-fifths">
                            <o-field label="Nombre">
                                <o-input v-model="grandPrix.name" name="name" expanded lazy></o-input>
                            </o-field>
                        </div>
                        <div class="column">
                            <o-field label="Gran Premio suspendido">
                                <o-switch
                                    class="mt-2"
                                    v-model="grandPrix.suspended"
                                    passive-type='is-success'
                                    type='is-danger'>
                                </o-switch> {{ grandPrix.suspended }}
                            </o-field>
                        </div>
                    </div>

                    <o-field label="Código del Gran Premio">
                        <o-input v-model="grandPrix.code" name="code" expanded lazy></o-input>
                    </o-field>

                    <o-field label="Circuito del Gran Premio">
                        <o-select v-model:class="grandPrix.circuit" placeholder="Selecciona un circuito" expanded>
                            <option
                                v-for="circuit in circuitList"
                                :value="circuit"
                                :key="circuit.id + '-' + circuit.variant.name">
                                {{ circuit.nameWithVariant() }}
                            </option>
                        </o-select>
                    </o-field>

                    <div class="columns">
                        <div class="column">
                            <o-field label="Ronda del Gran Premio">
                                <o-input v-model="grandPrix.round" name="round" expanded lazy :min=0 type="number"></o-input>
                            </o-field>
                        </div>
                        <div class="column">
                            <o-field label="Vueltas del Gran Premio">
                                <o-input v-model="grandPrix.laps" name="laps" expanded lazy :min=0 type="number"></o-input>
                            </o-field>
                        </div>
                    </div>

                    <o-field label="Imagen promocional del Gran Premio">
                        <o-input v-model="grandPrix.promo_image_url" name="promo_image_url" expanded lazy></o-input>
                    </o-field>

                    <hr />
                    <o-field>
                        <p class="control">
                            <o-button :disabled="!isDataOk()" label="Editar gran premio" @click="editGrandPrix()" variant="primary" />
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
import {circuitService, grandPrixService, seasonService} from "@/_services";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";
import {GrandPrix} from "@/types/GrandPrix";
import {Circuit} from "@/types/Circuit";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";

export default defineComponent({
    name: "CompetitionEdit",
    components: {
        AlertNoPermission,
        PrognoPageTitle,
    },
    setup() {
        const authStore = useAuthStore();

        const currentUser = authStore.user;
        return {currentUser};
    },
    data() {
        return {
            competition: {code: this.$route.params.competition} as Competition,
            season: {name: this.$route.params.season} as Season,
            id: this.$route.params.id,

            grandPrix: {} as GrandPrix,
            thereIsGrandPrix: false,
            isLoadingGrandPrix: true,

            circuitList: new Array<Circuit>(),
            seasonList: new Array<Season>(),
        }
    },
    methods: {
        isDataOk(): boolean {
            return !(this.grandPrix!.id == undefined
                && this.grandPrix!.code == undefined
                && this.grandPrix!.name == undefined
                && this.grandPrix!.circuit!.id == undefined
                && this.grandPrix!.laps == undefined
                && this.grandPrix!.promo_image_url == undefined
                && this.grandPrix!.round == undefined
                && this.grandPrix!.season!.id == undefined
            )
        },
        editGrandPrix(): void {
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
                this.$oruga.notification.open({
                    message: "Se ha editado correctamente el gran premio `" + result.name + "`",
                    variant: "success",
                });

                this.$router.push({
                    name: 'adminGps'
                })
            }).catch((error) => {
                this.$oruga.notification.open({
                    message: error.message,
                    variant: "danger",
                });
            });
        }
    },
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
});
</script>