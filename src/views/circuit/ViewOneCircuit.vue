<template>
    <div id="circuitDetails" class="box">
        <progno-page-title class="mb-5" :name="circuitName" />
        <div v-if="isLoading">
            <loading />
        </div>

        <p v-if="!thereIsCircuit">Circuito no encontrado</p>
        <template  v-else>
            <div class="columns">
                <div class="column">
                    <div class="card">
                        <div class="card-content">
                            <h2 class="title is-3">Resumen</h2>
                        </div>
                        <div class="card-image">
                            <figure class="image">
                                <img class="logoImage" v-if="circuit.logo_url !== undefined && circuit.logo_url.length > 0" :src="circuit.logo_url" alt="Logo image">
                            </figure>
                        </div>
                        <div class="card-content">
                            <div class="media">
                                <div class="media-content">
                                    <p class="title is-4">{{circuit.name}} {{ circuit.hasVariant ? ('-' + circuit.variant.name) : ""}}</p>
                                    <p class="subtitle is-6">{{circuit.locality}}, {{circuit.country}}</p>
                                </div>
                            </div>

                            <div class="content">
                                <p v-if="circuit.hasVariant" class="card-text"><b>Variante: </b>{{circuit.variant.name}}</p>
                                <p class="card-text"><b>Distancia por vuelta: </b>{{circuit.variant.distance}} km</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="box">
                        <h2 class="title is-3">Localización</h2>
                            < Mapa >
                        <figure class="image is-4by3">
                            <img :src="circuit.variant.layout_image" alt="Circuit layout image">
                        </figure>
                    </div>
                </div>
            </div>
            <div class="columns">
                <div class="column">
                    <div class="box">
                        <h2 class="title is-3">Grandes Premios que usaron el circuito</h2>
                        <p v-for="gp in grandPrixesUsingCircuit">{{gp.name}} de {{gp.season.name}}</p> <!--ToDo: Agregar diseño -->
                    </div>
                </div>
            </div>

        </template>
    </div>
</template>


<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import { Circuit } from "@/types/Circuit";
import { CircuitVariant } from "@/types/CircuitVariant";
import { circuitService } from "@/_services";
import CircuitCard from "@/components/gps/CircuitCard.vue";

import {LMap, LTileLayer, LMarker, LPopup, LTooltip} from "vue2-leaflet";
import {GrandPrix} from "../../types/GrandPrix";

@Component<ViewOneCircuit>({
    components: {
        CircuitCard,
        PrognoPageTitle,
        LMap,
        LTileLayer,
        LMarker,
        LPopup,
        LTooltip
    },
})
export default class ViewOneCircuit extends Vue {
    private circuit!: Circuit;
    private variant!: CircuitVariant;
    private isLoading: boolean = true;
    private thereIsCircuit: boolean = false;

    private grandPrixesUsingCircuit: Array<GrandPrix> = [];

    created() {
        let circuitId = this.$route.params.circuit;
        circuitService.getCircuit(circuitId).then((circuit) => {
            this.circuit = circuit;
            this.thereIsCircuit = true;

            circuitService.getGPThatUsesCircuit(circuit).then((gps) => {
               this.grandPrixesUsingCircuit = gps;
            });
        }).catch((reason) => {
            this.thereIsCircuit = false;
        }).finally(() => {
            this.isLoading = false;
        })
    }

    get circuitName() {
        return this.thereIsCircuit ? this.circuit.name : "Circuito no encontrado";
    }

}
</script>

<style scoped>
.logoImage {
    max-height: 420px;
}
</style>