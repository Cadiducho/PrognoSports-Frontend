<template>
  <PCard>
    <div
      class="flex items-center gap-3 lg:block"
      :class="wide ? 'md:flex' : 'md:block'"
    >
      <!-- Imagen: columna lateral acotada en móvil/tablet ancho; a todo el ancho de la columna en escritorio -->
      <div
        class="w-2/5 shrink-0 space-y-2 lg:w-auto"
        :class="wide ? 'md:w-1/3' : 'md:w-auto'"
      >
        <figure v-if="circuit.hasLogoImage">
          <img
            :src="circuit.logoImage()"
            alt="Logo image"
            class="mx-auto h-auto max-h-10 max-w-full object-contain lg:max-h-none"
            :class="wide ? 'md:max-h-12' : 'md:max-h-none'"
          >
        </figure>
        <figure>
          <img
            :src="variant.layoutImage(true)"
            alt="Circuit layout image"
            class="mx-auto h-auto max-h-40 max-w-full object-contain lg:max-h-none"
            :class="wide ? 'md:max-h-52' : 'md:max-h-none'"
          >
        </figure>
      </div>

      <main class="min-w-0 flex-1 lg:flex-none">
        <div class="flex items-start">
          <div class="basis-auto grow shrink">
            <p class="font-semibold text-base lg:text-xl">
              <router-link
                :to="circuit.circuitLink()"
                class="text-black dark:text-gray-200"
              >
                {{ circuit.name }} {{ variant.isDefault() ? "" : ('- ' + variant.name) }}
              </router-link>
            </p>
            <p class="font-normal text-sm lg:text-base mb-2 lg:mb-3">
              {{ circuit.locality }}, {{ circuit.country }}
            </p>
          </div>
        </div>

        <div class="mb-3">
          <p v-if="!variant.isDefault()">
            <b>Variante: </b>{{ variant.name }}
          </p>
          <p class="mt-2">
            <b>Distancia por vuelta: </b>{{ variant.distance }}km
          </p>
          <p
            v-if="hasLaps"
            class="mt-2"
          >
            <b>Vueltas: </b>{{ laps }}
          </p>
          <p
            v-if="hasLaps"
            class="mt-2"
          >
            <b>Distancia total: </b>{{ (laps * variant.distance).toFixed(2) }}km
          </p>
        </div>
        <PButton
          expanded
          tag="router-link"
          :to="circuit.circuitLink()"
          color="info"
          type="soft"
        >
          Más datos del circuito
        </PButton>
      </main>
    </div>
  </PCard>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {Circuit} from "@/types/Circuit";
import {CircuitVariant} from "@/types/CircuitVariant";
import PCard from "@/components/lib/PCard.vue";
import PButton from "@/components/lib/forms/PButton.vue";

defineOptions({ name: "CircuitCard" });

const props = withDefaults(defineProps<{
  circuit: Circuit;
  variant: CircuitVariant;
  laps?: number;
  // La card ocupa todo el ancho en tablet (md): usa la disposición horizontal también ahí
  wide?: boolean;
}>(), {
  laps: 0,
  wide: false,
});

const hasLaps = computed(() => props.laps > 0);
</script>
