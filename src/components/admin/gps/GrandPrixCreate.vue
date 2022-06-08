<template>
    <div id="createGrandPrix" class="box">
        <PrognoPageTitle class="mb-5" name="Crear gran premio" />

        <section v-if="isAdmin(currentUser)">
            <o-steps v-model="activeStep">
                <o-step-item step="1" label="Datos del gran premio">
                    <h2 class="title">Datos del gran premio</h2>

                    <o-field label="ID del Gran Premio">
                        <o-input v-model="createdGrandPrix.id" name="id" expanded lazy></o-input>
                    </o-field>

                    <o-field label="Nombre del Gran Premio">
                        <o-input v-model="createdGrandPrix.name" name="name" expanded lazy></o-input>
                    </o-field>

                    <o-field label="Código del Gran Premio">
                        <o-input v-model="createdGrandPrix.code" name="code" expanded lazy></o-input>
                    </o-field>

                    <o-field label="Circuito del Gran Premio">
                        <o-select v-model:class="createdGrandPrix.circuit" placeholder="Selecciona un circuito" expanded>
                            <option
                                v-for="circuit in circuits"
                                :value="circuit"
                                :key="circuit.id">
                                {{ circuit.nameWithVariant() }}
                            </option>
                        </o-select>
                    </o-field>

                    <div class="columns">
                        <div class="column">
                            <o-field label="Ronda del Gran Premio">
                                <o-input v-model="createdGrandPrix.round" name="round" expanded lazy :min=0 type="number"></o-input>
                            </o-field>
                        </div>
                        <div class="column">
                            <o-field label="Vueltas del Gran Premio">
                                <o-input v-model="createdGrandPrix.laps" name="laps" expanded lazy :min=0 type="number"></o-input>
                            </o-field>
                        </div>
                    </div>

                    <o-field label="Imagen promocional del Gran Premio">
                        <o-input v-model="createdGrandPrix.promo_image_url" name="promo_image_url" expanded lazy></o-input>
                    </o-field>

                    <o-field label="Temporada del Gran Premio">
                        <o-select v-model:class="createdGrandPrix.season" placeholder="Selecciona una temporada" expanded>
                            <option
                                v-for="ses in seasons"
                                :value="ses"
                                :key="ses.id">
                                {{ ses.name }} (#{{ ses.id }}) - {{ ses.competition.name }}
                            </option>
                        </o-select>
                    </o-field>

                    <hr/>

                </o-step-item>

                <o-step-item step="2" label="Finalizar">
                    <h2 class="title">Finalizar</h2>

                    <AlertInvalidData :object="createdGrandPrix.id" message="No has introducido ID para este gran premio" />
                    <AlertInvalidData :object="createdGrandPrix.name" message="No has introducido nombre para este gran premio" />
                    <AlertInvalidData :object="createdGrandPrix.code" message="No has introducido código para este gran premio" />
                    <AlertInvalidData :object="createdGrandPrix.round" message="No has introducido ronda para este gran premio" />
                    <AlertInvalidData :object="createdGrandPrix.laps" message="No has introducido laps para este gran premio" />
                    <AlertInvalidData :object="createdGrandPrix.promo_image_url" message="No has introducido imagen para este gran premio" />
                    <AlertInvalidData :object="createdGrandPrix.season" message="No has introducido temporada para este gran premio" />

                    <div class="notification has-background-primary">
                        Revisa los datos, se va a crear la siguiente competición
                    </div>

                    <div class="content">
                        <p class="card-text"><b>ID del Gran Premio: </b>{{ createdGrandPrix.id }}</p>
                        <p class="card-text"><b>Nombre del Gran Premio: </b>{{ createdGrandPrix.name }}</p>
                        <p class="card-text"><b>Código del Gran Premio: </b>{{ createdGrandPrix.code }}</p>
                        <p class="card-text"><b>Circuito del Gran Premio: </b>{{ createdGrandPrix.circuit }}</p>
                        <p class="card-text"><b>Ronda del Gran Premio: </b>{{ createdGrandPrix.round }}</p>
                        <p class="card-text"><b>Vueltas al Gran Premio: </b>{{ createdGrandPrix.laps }}</p>
                        <p class="card-text"><b>Imagen del Gran Premio: </b>{{ createdGrandPrix.code }}</p>
                        <p class="card-text"><b>Temporada del Gran Premio: </b>{{ createdGrandPrix.season }}</p>
                    </div>

                    <hr/>
                    <o-field>
                        <p class="control">
                            <o-button :disabled="!isDataOk()" label="Crear Gran Premio" @click="registerGrandPrix()" variant="primary" />
                        </p>
                    </o-field>
                </o-step-item>
            </o-steps>
        </section>
        <section v-else>
            <AlertNoPermission />
        </section>
    </div>
</template>

<script lang="ts">
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue"
import {circuitService, grandPrixService, seasonService} from "@/_services";
import AlertInvalidData from "@/components/lib/AlertInvalidData.vue";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import {GrandPrix} from "@/types/GrandPrix";
import {Season} from "@/types/Season";
import {Circuit} from "@/types/Circuit";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";

export default defineComponent({
    name: "SeasonCreate",
    components: {
        AlertNoPermission,
        AlertInvalidData,
        PrognoPageTitle,
    },
    setup() {
        const authStore = useAuthStore();

        const currentUser = authStore.user;
        return { currentUser };
    },
    data() {
        return {
            activeStep: 0,
            circuits: new Array<Circuit>(),
            seasons: new  Array<Season>(),

            createdGrandPrix: {
                id: undefined!,
                code: undefined!,
                name: undefined!,
                circuit: undefined!,
                competition: undefined!,
                laps: undefined!,
                promo_image_url: undefined!,
                round: undefined!,
                season: undefined!,
                suspended: false,
                sessions: [],
            } as GrandPrix
        }
    },
    mounted() {
        circuitService.getCircuitList().then((list) => {
            this.circuits = [];
            this.circuits.push(...list);
        });
        seasonService.getSeasonList().then((list) => {
            this.seasons = [];
            this.seasons.push(...list);
        });
    },
    methods: {
        isDataOk(): boolean {
            return !(this.createdGrandPrix.id == undefined
                && this.createdGrandPrix.code == undefined
                && this.createdGrandPrix.name == undefined
                && this.createdGrandPrix.circuit == undefined
                && this.createdGrandPrix.laps == undefined
                && this.createdGrandPrix.promo_image_url == undefined
                && this.createdGrandPrix.round == undefined
                && this.createdGrandPrix.season == undefined
            )
        },
        registerGrandPrix(): void {
            let data = {
                id: this.createdGrandPrix.id,
                season: this.createdGrandPrix.season.id,
                competition: this.createdGrandPrix.season.competition.id,
                round: this.createdGrandPrix.round,
                name: this.createdGrandPrix.name,
                code: this.createdGrandPrix.code,
                circuit: this.createdGrandPrix.circuit.id,
                variant: this.createdGrandPrix.circuit.variant.name,
                promo_image_url: this.createdGrandPrix.promo_image_url,
                laps: this.createdGrandPrix.laps
            }

            grandPrixService.createGrandPrix(data).then((result) => {
                this.$oruga.notification.open({
                    message: "Se ha registrado correctamente el Gran Premio `" + result.id + "`",
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
    }
});
</script>