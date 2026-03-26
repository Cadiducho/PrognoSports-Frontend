<template>
  <PCard id="circuitDetails">
    <loading v-if="isLoading" />

    <p v-if="!thereIsCircuit">
      El circuito buscado con nombre <i>{{ circuit.id }}</i> no ha sido encontrado
    </p>
    <template v-else>
      <PTitle
        class="mb-5"
        :name="circuit.name"
      />

      <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div class="xl:col-span-2 p-4">
          <div class="relative pb-96 overflow-hidden">
            <img
              class="absolute inset-0 h-full w-full object-contain"
              :src="circuit.layoutImage(selectedVariant)"
              alt="Circuit layout"
            >
          </div>
        </div>
        <div class="flex flex-col justify-around p-4 text-2xl xl:col-span-1">
          <div class="inline-grid grid-cols-2 gap-4 text-slate-800 dark:text-slate-100">
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Nombre
              </p>
              <p class="font-bold">
                {{ circuit.name }}
              </p>
            </div>
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Variante
              </p>
              <p class="font-bold">
                {{ circuit.variants[selectedVariant].name }}
              </p>
            </div>
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Distancia por vuelta
              </p>
              <p class="font-bold">
                {{ circuit.variants[selectedVariant].distance }}km
              </p>
            </div>
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Curvas
              </p>
              <p class="font-bold">
                {{ circuit.variants[selectedVariant].turns }}
              </p>
            </div>
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Localidad
              </p>
              <p class="font-bold">
                {{ circuit.locality }}
              </p>
            </div>
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                País
              </p>
              <p class="font-bold">
                {{ circuit.country }}
              </p>
            </div>
          </div>
          <section>
            <h4 class="mb-1 mt-5 font-semibold text-slate-800 dark:text-slate-100">
              Variantes
            </h4>
            <button
              v-for="(variant, index) in circuit.variants"
              :key="variant.name + index"
              class="mb-2 mr-3 rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-600"
              @click="selectedVariant = index"
            >
              {{ variant.name }}
            </button>
          </section>
        </div>

        <div class="flex w-full justify-center p-4 xl:col-span-3">
          <div
            class="h-64 w-5/6"
          >
            <l-map
              :zoom="zoom"
              :center="center"
              :options="mapOptions"
              style="height: 100%"
            >
              <l-tile-layer
                :url="tileUrl"
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

      <h3 class="mt-5 text-2xl font-semibold text-slate-900 dark:text-slate-100">
        Grandes Premios que usaron el circuito
      </h3>
      <section
        v-if="grandPrixesUsingCircuit.length"
        class="mt-3 grid grid-cols-1 gap-5 md:auto-rows-fr md:grid-cols-2 xl:grid-cols-4"
      >
        <CircuitGrandPrixMiniCard
          v-for="gp in grandPrixesUsingCircuit"
          :key="gp.id"
          :gp="gp"
        />
      </section>
      <span
        v-else
        class="mt-3 inline-block text-slate-600 dark:text-slate-300"
      >No se ha usado este circuito en ningún Gran Premio</span>
    </template>
  </PCard>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import { useRoute } from "vue-router";

import { circuitService, grandPrixService, notificationService } from "@/_services";
import CircuitGrandPrixMiniCard from "@/components/circuits/CircuitGrandPrixMiniCard.vue";
import Loading from "@/components/lib/Loading.vue";
import PCard from "@/components/lib/PCard.vue";
import PTitle from "@/components/lib/PTitle.vue";
import useEmitter from "@/composables/useEmitter";
import { Circuit } from "@/types/Circuit";
import { GrandPrix } from "@/types/GrandPrix";

import { latLng, type LatLng } from "leaflet";
import { LMap, LMarker, LPopup, LTileLayer } from "@vue-leaflet/vue-leaflet";
import {useThemeStore} from "@/store/themeStore";
import {storeToRefs} from "pinia";

defineOptions({ name: "OneCircuit" });

const emitter = useEmitter();
const route = useRoute();

const circuit = ref<Circuit>({ id: route.params.circuit } as Circuit);
const selectedVariant = ref(0);
const isLoading = ref(true);
const thereIsCircuit = ref(false);
const grandPrixesUsingCircuit = ref<Array<GrandPrix>>([]);

const zoom = ref(14);
const center = ref<LatLng>(latLng(0, 0));
const mapOptions = {
  zoomSnap: 0.5,
};
const { darkMode } = storeToRefs(useThemeStore());
const tileUrl = computed(() => {
  return darkMode.value
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
})
const attribution = computed(() => {
  return darkMode.value
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})


onMounted(() => {
  Promise.all([
    circuitService.getCircuit(circuit.value.id),
    grandPrixService.getGPThatUsesCircuit(circuit.value),
  ]).then(([searchedCircuit, gpsUsing]) => {
    circuit.value = searchedCircuit;
    thereIsCircuit.value = true;
    center.value = latLng(circuit.value.latitude, circuit.value.longitude);
    grandPrixesUsingCircuit.value = gpsUsing;
  }).catch((error) => {
    thereIsCircuit.value = false;
    notificationService.showNotification(error.message, "error");
  }).finally(() => {
    isLoading.value = false;
    emitter.emit("breadcrumbLastname", circuit.value.name);
  });
});

defineExpose({
  selectedVariant,
  isLoading,
  thereIsCircuit,
  grandPrixesUsingCircuit,
});
</script>
