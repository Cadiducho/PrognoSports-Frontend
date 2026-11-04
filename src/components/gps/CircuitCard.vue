<template>
  <PCard>
    <div class="flex flex-col gap-4 sm:flex-row">
      <!-- Imágenes: al menos 1/4 del ancho de la fila -->
      <div class="w-full shrink-0 space-y-2 sm:w-1/4">
        <figure v-if="circuit.hasLogoImage">
          <img
            :src="circuitLogoImageUrl(circuit)"
            alt="Logo image"
            class="mx-auto h-auto max-h-12 max-w-full object-contain"
          >
        </figure>
        <figure>
          <img
            :src="circuitVariantLayoutImageUrl(variant, true)"
            alt="Circuit layout image"
            class="mx-auto h-auto max-h-48 max-w-full object-contain"
          >
        </figure>
      </div>

      <main class="flex min-w-0 flex-1 flex-col">
        <p class="text-base font-semibold lg:text-xl">
          <router-link
            :to="circuitLink(circuit)"
            class="text-black dark:text-gray-200"
          >
            {{ circuit.name }} {{ isDefaultCircuitVariant(variant) ? "" : ('- ' + variant.name) }}
          </router-link>
        </p>
        <p class="mb-3 text-sm font-normal lg:text-base">
          {{ circuit.locality }}, {{ circuit.country }}
        </p>

        <div class="mb-3 grid grid-cols-2 gap-2 md:grid-cols-4">
          <p v-if="!isDefaultCircuitVariant(variant)">
            <b>Variante: </b>{{ variant.name }}
          </p>
          <p>
            <b>Distancia por vuelta: </b>{{ variant.distance }}km
          </p>
          <p v-if="hasLaps">
            <b>Vueltas: </b>{{ laps }}
          </p>
          <p v-if="hasLaps">
            <b>Distancia total: </b>{{ (laps * variant.distance).toFixed(2) }}km
          </p>
        </div>

        <div class="mt-auto">
          <PButton
            tag="router-link"
            :to="circuitLink(circuit)"
            color="info"
            type="soft"
          >
            Más datos del circuito
          </PButton>
        </div>
      </main>
    </div>
  </PCard>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {circuitLink, circuitLogoImageUrl, circuitVariantLayoutImageUrl, isDefaultCircuitVariant} from "@/utils/circuit";
import {Circuit} from "@/types/Circuit";
import {CircuitVariant} from "@/types/CircuitVariant";
import PCard from "@/components/lib/PCard.vue";
import PButton from "@/components/lib/forms/PButton.vue";

defineOptions({ name: "CircuitCard" });

const props = withDefaults(defineProps<{
  circuit: Circuit;
  variant: CircuitVariant;
  laps?: number;
}>(), {
  laps: 0,
});

const hasLaps = computed(() => props.laps > 0);
</script>
