<template>
    <div id="adminDrivers" class="box">

        <section v-if="isAdmin(currentUser)">

            <loading v-if="isLoadingGrandPrix" />
            <template v-else>

                <div class="columns is-variable is-5">
                    <div class="column">
                        <PrognoPageTitle :name="'Administración de ' + grandPrix.name + ' de ' + grandPrix.season.name" />
                    </div>
                    <div class="column is-3">
                        <GrandPrixPagination isAdmin :competition="competition" :grand-prix="grandPrix"/>
                    </div>
                </div>

                <div class="block">
                    <o-button variant="link" to="/admin/gps" tag="router-link">Lista de grandes premios</o-button>
                </div>

                <p v-if="!thereIsGrandPrix">El Gran Premio {{ id }} no ha sido encontrado</p>
                <template v-else>

                    <div class="columns">
                        <div class="column is-one-fifth">
                            <SessionsInGrandPrix :grand-prix="grandPrix" :sessions="grandPrix.sessions" />
                        </div>
                        <div class="column">
                            <h2 class="title">Datos del {{ grandPrix.name }}</h2>

                            <div class="columns">
                                <div class="column is-four-fifths">
                                    <o-field label="Nombre">
                                        <o-input v-model="grandPrix.name" name="name" expanded lazy></o-input>
                                    </o-field>
                                </div>
                                <div class="column">
                                    <o-field label="Estado">
                                        <o-switch
                                            class="mt-2"
                                            v-model="grandPrix.suspended"
                                            variant="danger"
                                            passive-variant="primary">
                                            {{ grandPrix.suspended ? "Suspendido" : "Activo"}}
                                        </o-switch>
                                    </o-field>
                                </div>
                            </div>

                            <o-field label="Código del Gran Premio">
                                <o-input v-model="grandPrix.code" name="code" expanded lazy></o-input>
                            </o-field>

                            <o-field label="Circuito del Gran Premio">
                                <o-select v-model="grandPrix.circuit" placeholder="Selecciona un circuito" expanded>
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

                            <figure v-if="grandPrix.promo_image_url !== undefined" class="image is-256x256">
                                <img :src="grandPrix.promo_image_url">
                            </figure>


                            <button class="button is-primary mt-0" :disabled="!isDataOk()" @click="editGrandPrix()">Editar datos del gran premio</button>
                        </div>
                    </div>

                    <hr />

                    <DriversInGrandPrix v-if="thereIsGrandPrix" :grand-prix="grandPrix" />

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
import SessionsInGrandPrix from "@/components/admin/gps/edit/SessionsInGrandPrix.vue";
import DriversInGrandPrix from "@/components/admin/gps/edit/DriversInGrandPrix.vue";
import GrandPrixPagination from "@/components/gps/GrandPrixPagination.vue";

export default defineComponent({
    name: "GrandPrixEditPage",
    components: {
        DriversInGrandPrix,
        AlertNoPermission,
        PrognoPageTitle,
        SessionsInGrandPrix,
        GrandPrixPagination,
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
                    position: 'top',
                    message: "Se ha editado correctamente el gran premio `" + result.name + "`",
                    variant: "success",
                });

                this.$router.push({
                    name: 'adminGps'
                })
            }).catch((error) => {
                this.$oruga.notification.open({
                    position: 'top',
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
            }
        );
    }
});
</script>
<style>
.image.is-256x256 {
    height: 256px;
    width: 256px;
}
</style>