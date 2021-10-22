<template>
    <div id="circuitDetails" class="box">
        <progno-page-title class="mb-5" :name="circuitName" />
        <div v-if="isLoading">
            <loading />
        </div>

        <p v-if="!thereIsCircuit">El circuito buscado con nombre <i>{{ getRawCircuitName }}</i> no ha sido encontrado</p>
        <template v-else>
            <div class="tabs">
                <ul>
                    <li v-for="tab in variantTabs"
                        v-bind:class="{ 'is-active': (variant.name === tab.label) }">
                        <router-link
                            :to='"/circuits/" + circuit.id + "/" + tab.label'>
                            {{ tab.label }}
                        </router-link>
                    </li>
                </ul>
            </div>

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
                                    <p class="title is-4">{{circuit.name}} {{ hasVariant(circuit) ? ('- ' + circuit.variant.name) : ""}}</p>
                                    <p class="subtitle is-6">{{circuit.locality}}, {{circuit.country}}</p>
                                </div>
                            </div>

                            <div class="content">
                                <p v-if="hasVariant(circuit)" class="card-text">
                                    <i class="fas fa-fw fa-random mr-2"></i>
                                    <b>Variante: </b>{{circuit.variant.name}}
                                </p>
                                <p class="card-text">
                                    <i class="fas fa-fw fa-map-marked-alt mr-2"></i>
                                    <b>Ubicación: </b>{{circuit.latitude}}º, {{circuit.longitude}}º
                                </p>
                                <p class="card-text">
                                    <i class="fas fa-fw fa-ruler mr-2"></i>
                                    <b>Distancia por vuelta: </b>{{circuit.variant.distance}} km
                                </p>
                                <p class="card-text">
                                    <i class="fas fa-fw fa-directions mr-2"></i>
                                    <b>Curvas: </b>{{circuit.variant.turns}}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="box">
                        <h2 class="title is-3">Localización</h2>
                        <div style="height: 500px; width: 100%">
                            <l-map
                                :zoom="zoom"
                                :center="center"
                                :options="mapOptions"
                                style="height: 100%"
                            >
                                <l-tile-layer
                                    :url="url"
                                    :attribution="attribution"
                                />
                                <l-marker :lat-lng="center">
                                    <l-popup>
                                        <div>
                                            {{ circuitName }}
                                        </div>
                                    </l-popup>
                                </l-marker>
                            </l-map>
                        </div>
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
                        <article class="mt-5 columns is-multiline">
                            <div class="is-inline-block zoom ml-4 mr-4 mb-4" v-for="gp in grandPrixesUsingCircuit">
                                <div class="card">
                                    <div class="card-content">
                                        <p class="title">
                                            {{gp.name}} de {{gp.season.name}}
                                        </p>
                                        <p class="subtitle">
                                            {{gp.circuit.name}}, {{gp.circuit.locality}} ({{gp.circuit.country}})
                                        </p>
                                        <p class="subtitle">
                                            Carrera del {{gp.raceTime | humanDateTime}} ({{gp.raceTime | dateDiff }})
                                        </p>
                                    </div>

                                    <b-button tag="router-link"
                                              :to="{
                                            name: 'gpdetails',
                                            params: {
                                                competition: gp.competition.code,
                                                season: gp.season.name,
                                                id: gp.id,
                                            }
                                          }"
                                              type="is-info is-light" expanded>
                                        Detalles
                                    </b-button>
                                </div>
                            </div>
                        </article>
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

import { LatLng, latLng} from "leaflet";
import {LMap, LTileLayer, LMarker, LPopup, LTooltip} from "vue2-leaflet";
import {GrandPrix} from "@/types/GrandPrix";
import {hasVariant} from "@/utils";

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

    zoom = 14;
    private center!: LatLng;
    url= 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    attribution= '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
    mapOptions= {
        zoomSnap: 0.5
    };

    private grandPrixesUsingCircuit: Array<GrandPrix> = [];
    private circuitVariants: Array<CircuitVariant> = [];

    created() {
        let circuitId = this.$route.params.circuit;
        let variantId = this.$route.params.variant;
        if (!this.thereIsVariant(variantId)) {
            this.variant = {name: "grandprix"} as CircuitVariant;
        } else {
            this.variant = {name: variantId} as CircuitVariant;
        }

        circuitService.getCircuitWithVariant(circuitId, this.variant.name).then((circuit) => {
            this.circuit = circuit;
            this.thereIsCircuit = true;
            this.center = latLng(circuit.latitude, circuit.longitude);

            circuitService.getGPThatUsesCircuit(circuit, this.variant).then((gps) => {
                this.grandPrixesUsingCircuit = gps;
            });
            circuitService.listCircuitVariant(circuit).then((vars) => {
                this.circuitVariants = vars;
            });
        }).catch((reason) => {
            this.thereIsCircuit = false;
        }).finally(() => {
            this.isLoading = false;
        })
    }

    /**
     * Comprobar si un texto que debería ser una Variante de Circuito es válida o no
     * @param variantId la supuesta variante
     * @return True si el parámetro es undefined o es igual a "grandprix"
     */
    private thereIsVariant(variantId: string): boolean {
        return !(variantId === undefined || variantId === "grandprix");
    }

    /**
     * Devuelve el nombre del circuito y, si es necesario, especificando su nombre de variante
     */
    get circuitName(): string {
        if (this.thereIsCircuit) {
            if (hasVariant(this.circuit)) {
                return this.circuit.name + " (" + this.variant.name + ")";
            }
            return this.circuit.name;
        } else {
            return "Circuito no encontrado";
        }
    }

    get getRawCircuitName() {
        let variant = this.thereIsVariant(this.$route.params.variant) ? ' y la variante ' + this.$route.params.variant : "";
        return this.$route.params.circuit + variant;
    }

    get variantTabs() {
        let tabs: { id: string; label: string; }[] = [];
        if (this.circuitVariants.length > 1) {
            this.circuitVariants.forEach((value: CircuitVariant) => {
                let label = value.name === "grandprix" ? "GrandPrix" : value.name;
                tabs.push({
                    id: value.name.toLowerCase(),
                    label: label,
                });
            })
        }
        return tabs;
    }
}
</script>

<style scoped>
.logoImage {
    max-height: 420px;
}
</style>