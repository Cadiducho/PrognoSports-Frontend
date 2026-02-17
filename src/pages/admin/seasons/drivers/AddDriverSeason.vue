<template>
  <loading v-if="isLoading" />
  <PCard v-else>
    <PTitle
      class="mb-5"
      :name="`Agregar Piloto a la temporada ${season.name}`"
    />
    <nav class="flex justify-between mb-4">
      <section class="flex flex-wrap">
        <p-button
          color="info"
          icon="fa fa-chevron-left"
          :to="{name: 'adminDriversInSeason'}"
          tag="router-link"
          class="mr-2"
        >
          Volver listado de Pilotos en la temporada
        </p-button>
      </section>
    </nav>

    <form>
      <p-select
        v-model="addedDriver.id"
        label="Piloto"
        placeholder="Selecciona un piloto"
        class="mb-3"
      >
        <option
          v-for="driver in driversList"
          :key="driver.id"
          :value="driver.id"
        >
          {{ driver.firstname }} {{ driver.lastname }} (#{{ driver.code }})
        </option>
      </p-select>
      <PInput
        v-model="addedDriver.number"
        label="Número"
        placeholder="Número"
        name="number"
        type="number"
      />
      <PField
        label="Color del piloto en la temporada"
        required
      >
        <ColorPicker
          v-model="addedDriver.color"
          required
        />
      </PField>

      <PButton
        class="mt-4"
        :disabled="!isDataOk()"
        type="solid"
        label="Agregar piloto a la temporada"
        @click="addDriverToSeason()"
      />
    </form>
  </PCard>
</template>

<script setup lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import {driversService, notificationService, seasonService} from "@/_services";

import {onMounted, ref} from "vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import {useRoute, useRouter} from "vue-router";
import PCard from "@/components/lib/PCard.vue";
import PSelect from "@/components/lib/forms/PSelect.vue";
import {Season} from "@/types/Season";
import Loading from "@/components/lib/Loading.vue";
import {Driver} from "@/types/Driver";
import ColorPicker from "@/components/lib/forms/ColorPicker.vue";
import PField from "@/components/lib/forms/PField.vue";

const router = useRouter();
const route = useRoute();

const isLoading = ref(true);
const season = ref({} as Season);
const driversList = ref([] as Array<Driver>);
const addedDriver = ref({
  id: 0,
  number: '',
  color: ''
})

onMounted(async () => {
  try {
    const [seasonResponse, driversListResponse] = await Promise.all([
      seasonService.getSeason(route.params.season as string),
      driversService.getAllDrivers()
    ])

    season.value = seasonResponse;
    driversList.value = driversListResponse;

    isLoading.value = false;
  } catch (e) {
    console.error(e);
    notificationService.showNotification("Error al cargar los datos", "error");
  }
});

const isDataOk = (): boolean => {
  return !!(addedDriver.value.id && addedDriver.value.number && addedDriver.value.color)
};

const addDriverToSeason = async () => {
  try {
    const rawData = {
      driver: addedDriver.value.id,
      number: Number.parseFloat(addedDriver.value.number),
      color: addedDriver.value.color
    }
    const result = await driversService.linkDriverToSeason(season.value, rawData);
    notificationService.showNotification("Se ha añadido correctamente el piloto `" + result.code + "`");

    router.push({
      name: 'adminDriversInSeason'
    });
  } catch (error: any) {
    notificationService.showNotification(error.message, "error");
  }
}
</script>
