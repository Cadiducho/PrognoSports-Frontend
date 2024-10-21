<template>
  <loading v-if="isLoading" />
  <PCard v-else>
    <PTitle
      class="mb-5"
      :name="`Agregar Gran Premio a la temporada ${season.name}`"
    />
    <nav class="flex justify-between mb-4">
      <section class="flex flex-wrap">
        <p-button
          color="info"
          icon="fa fa-chevron-left"
          :to="{name: 'adminGpsInSeason'}"
          tag="router-link"
          class="mr-2"
        >
          Volver listado de GPs en la temporada
        </p-button>
      </section>
    </nav>

    <form>
      <p-select
        v-model="addedGP.id"
        label="Gran Premio"
        placeholder="Selecciona un gran premio"
        class="mb-3"
      >
        <option
          v-for="gp in gpsList"
          :key="gp.id"
          :value="gp.id"
        >
          {{ gp.name }}
        </option>
      </p-select>
      <p-select
        v-model="addedGP.circuit"
        label="Circuito"
        placeholder="Selecciona un circuito"
        class="mb-3"
      >
        <option
          v-for="circuit in circuitList"
          :key="circuit.id"
          :value="circuit"
        >
          {{ circuit.name }}
        </option>
      </p-select>
      <p-select
        v-if="addedGP.circuit && addedGP.circuit.variants && addedGP.circuit.variants.length > 1"
        v-model="addedGP.variant.id"
        label="Variante del Circuito"
        placeholder="Selecciona una variante"
        class="mb-3"
      >
        <option
          v-for="variant in addedGP.circuit.variants"
          :key="variant.id"
          :value="variant.id"
        >
          {{ variant.name }}
        </option>
      </p-select>
      <PInput
        v-model="addedGP.laps"
        label="Vueltas"
        placeholder="Vueltas"
        name="laps"
      />
      <PInput
        v-model="addedGP.round"
        label="Ronda"
        placeholder="Ronda"
        name="round"
      />

      <PButton
        class="mt-4"
        :disabled="!isDataOk()"
        type="solid"
        label="Crear temporada"
        @click="addGrandPrixToSeason()"
      />
    </form>
  </PCard>
</template>

<script setup lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import {circuitService, grandPrixService, notificationService, seasonService} from "@/_services";

import {onMounted, ref} from "vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import {useRoute, useRouter} from "vue-router";
import PCard from "@/components/lib/PCard.vue";
import PSelect from "@/components/lib/forms/PSelect.vue";
import {Season} from "@/types/Season";
import Loading from "@/components/lib/Loading.vue";
import {GrandPrix} from "@/types/GrandPrix";
import {Circuit} from "@/types/Circuit";
import {CircuitVariant} from "@/types/CircuitVariant";

const router = useRouter();
const route = useRoute();

const isLoading = ref(true);
const season = ref({} as Season);
const gpsList = ref([] as Array<GrandPrix>);
const circuitList = ref([] as Array<Circuit>);
const addedGP = ref({
  id: 0,
  circuit: {} as Circuit,
  variant: {} as CircuitVariant,
  laps: 0,
  round: 0
})

onMounted(async () => {
  try {
    const [seasonResponse, gpsListResponse, circuitListResponse] = await Promise.all([
      seasonService.getSeason(route.params.season as string),
      grandPrixService.getAllGrandPrixes(),
      circuitService.getCircuitList()
    ])

    season.value = seasonResponse;
    gpsList.value = gpsListResponse;
    circuitList.value = circuitListResponse;

    console.log('season', season)
    console.log('list', gpsList)
    console.log('circuits', circuitList)
    isLoading.value = false;
  } catch (e) {

  }
});

const needVariant = addedGP.value.circuit?.variants?.length > 1;
const isDataOk = (): boolean => {
  const baseConditions = addedGP.value.id && addedGP.value.circuit?.id && addedGP.value.laps > 0 && addedGP.value.round > 0;

  return !!(needVariant ? baseConditions && addedGP.value.variant?.id : baseConditions);
};

const addGrandPrixToSeason = async () => {
  const seasonId = route.params.season.toString()
  console.log('addedGP', addedGP.value)
  console.log('season', season)

  const rawData = {
    gp: addedGP.value.id,
    circuit: addedGP.value.circuit?.id,
    variant: needVariant ? addedGP.value.variant?.id : addedGP.value.circuit?.variants[0]?.id,
    laps: addedGP.value.laps,
    round: addedGP.value.round
  }

  try {
    const result = await grandPrixService.linkGrandPrixToSeason(seasonId, rawData)
    notificationService.showNotification("Se ha añadido correctamente el gran premio `" + result.name + "`");

    router.push({
      name: 'adminGpEditInSeason',
      params: { gp: result.id }
    })
  } catch (error: any) {
    notificationService.showNotification(error.message, "error");
  }
}
</script>
