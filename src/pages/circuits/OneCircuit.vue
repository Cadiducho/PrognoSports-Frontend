<template>
    <div id="circuitDetails" class="box">
        <loading v-if="isLoading"/>

        <p v-if="!thereIsCircuit">El circuito buscado con nombre <i>{{ this.circuit.id }}</i> no ha sido encontrado</p>
        <template v-else>
            <PTitle class="mb-5" :name="circuit.name" />

            <div class="flex flex-wrap">
                <div class="w-full xl:w-2/3 p-4">
                    <div class="relative pb-96 overflow-hidden">
                        <img class="absolute inset-0 h-full w-full object-contain" :src="circuit.layoutImage(this.selectedVariant)" alt="Circuit layout" />
                    </div>
                </div>
                <div class="w-full xl:w-1/3 p-4 text-2xl flex flex-col justify-around">
                    <div class="inline-grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm">Nombre</p>
                            <p class="font-bold">{{ circuit.name }}</p>
                        </div>
                        <div>
                            <p class="text-sm">Variante</p>
                            <p class="font-bold">{{ circuit.variants[this.selectedVariant].name }}</p>
                        </div>
                        <div>
                            <p class="text-sm">Distancia por vuelta</p>
                            <p class="font-bold">{{ circuit.variants[this.selectedVariant].distance }}km</p>
                        </div>
                        <div>
                            <p class="text-sm">Curvas</p>
                            <p class="font-bold">{{ circuit.variants[this.selectedVariant].turns }}</p>
                        </div>
                        <div>
                            <p class="text-sm">Localidad</p>
                            <p class="font-bold">{{ circuit.locality }}</p>
                        </div>
                        <div>
                            <p class="text-sm">País</p>
                            <p class="font-bold">{{ circuit.country }}</p>
                        </div>
                    </div>
                    <section>
                        <h4 class="font-semibold mt-5 mb-1">Variantes</h4>
                        <button v-for="(variant, index) in circuit.variants"
                                class="px-4 py-2 mr-3 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm"
                                @click="selectedVariant = index"
                        >
                            {{ variant.name }}
                        </button>
                    </section>
                </div>


                <div class="w-full p-4 flex justify-center">
                    <div class="w-5/6" style="height: 250px">
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
                                        {{ circuit.name }}
                                    </div>
                                </l-popup>
                            </l-marker>
                        </l-map>
                    </div>
                </div>
            </div>

            <h3 class="title is-3 mt-5">Grandes Premios que usaron el circuito</h3>
            <section class="flex flex-wrap -mx-4" v-if="grandPrixesUsingCircuit.length">
                <article v-for="gp in grandPrixesUsingCircuit"
                         class="w-full sm:w-1/2 md:w-1/3 xl:w-1/5 p-4">
                    <router-link
                        :to="gp.gpLink()"
                        class="c-card block bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden text-gray-700 hover:scale-110 transition ease-in-out delay-150 duration-300">

                        <div class="p-4">
                            <h2 class="mt-2 font-bold">{{ gp.name }} de {{ gp.season.name }}</h2>
                            <span class="mb-1 inline-block px-2 py-1 leading-none bg-orange-200 text-orange-800 rounded-full font-semibold tracking-wide text-xs">
                                Ronda #{{ gp.round }}
                            </span>
                            <p class="text-sm">{{ gp.circuit.name }}, {{ gp.circuit.locality }} ({{ gp.circuit.country }})</p>
                        </div>

                        <div class="p-4 border-t border-b text-xs text-gray-700">
                            <span v-for="(session, key) in gp.sessions" :key="key" class="flex justify-between items-center mb-1">
                                <b class="mr-1 flex">{{ session.humanName() }}:</b> {{ humanDateTime(session.date) }} ({{ dateDiff(session.date) }}) <br/>
                            </span>
                        </div>
                    </router-link>
                </article>
            </section>
            <span v-else>No se ha usado este circuito en ningún Gran Premio</span>

        </template>
    </div>
</template>


<script lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import { Circuit } from "@/types/Circuit";
import {circuitService, grandPrixService, notificationService} from "@/_services";
import CircuitCard from "@/components/gps/CircuitCard.vue";

import { LatLng, latLng} from "leaflet";
import {LMap, LTileLayer, LMarker, LPopup, LTooltip} from "@vue-leaflet/vue-leaflet";
import {GrandPrix} from "@/types/GrandPrix";
import {defineComponent} from "vue";
import useEmitter from "@/composables/useEmitter";
import {useDayjs} from "@/composables/useDayjs";
import Loading from "@/components/lib/Loading.vue";

export default defineComponent({
    name: "OneCircuit",
    components: {
        Loading,
        CircuitCard,
        PTitle,
        LMap,
        LTileLayer,
        LMarker,
        LPopup,
        LTooltip
    },
    setup() {
        const emitter = useEmitter();
        const dayjs = useDayjs();

        const humanDate = dayjs.humanDate;
        const dateDiff = dayjs.dateDiff;
        const humanDateTime = dayjs.humanDateTime;
        return { emitter, humanDate, dateDiff, humanDateTime }
    },
    data() {
        return {
            circuit: {id: this.$route.params.circuit} as Circuit,
            selectedVariant: 0,
            isLoading: true,
            thereIsCircuit: false,
            grandPrixesUsingCircuit: new Array<GrandPrix>(),

            zoom: 14,
            center: {} as LatLng,
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            mapOptions: {
                zoomSnap: 0.5
            },
        }
    },
    mounted() {
        Promise.all([
            circuitService.getCircuit(this.circuit.id),
            grandPrixService.getGPThatUsesCircuit(this.circuit)
        ]).then(([circuit, gpsUsing]) => {
            this.circuit = circuit;
            this.thereIsCircuit = true;
            this.center = latLng(this.circuit.latitude, this.circuit.longitude);
            this.grandPrixesUsingCircuit = gpsUsing;
        }).catch((error) => {
            this.thereIsCircuit = false;
            notificationService.showNotification(error.message, 'error');
        }).finally(() => {
            this.isLoading = false;
            this.emitter.emit('breadcrumbLastname', this.circuit.name);
        });
    }
});
</script>