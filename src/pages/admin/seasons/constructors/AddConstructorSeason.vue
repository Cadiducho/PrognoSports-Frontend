<template>
  <loading v-if="isLoading" />
  <PCard v-else>
    <PTitle
      class="mb-5"
      :name="`Agregar Constructor a la temporada ${season.name}`"
    />
    <nav class="flex justify-between mb-4">
      <section class="flex flex-wrap">
        <p-button
          color="info"
          icon="fa fa-chevron-left"
          :to="{name: 'adminConstructorsInSeason'}"
          tag="router-link"
          class="mr-2"
        >
          Volver listado de Constructores en la temporada
        </p-button>
      </section>
    </nav>

    <form>
      <p-select
        v-model="addedConstructor.id"
        label="Constructor"
        placeholder="Selecciona un constructor"
        class="mb-3"
      >
        <option
          v-for="cons in constructorsList"
          :key="cons.id"
          :value="cons.id"
        >
          {{ cons.name }}
        </option>
      </p-select>
      <PInput
        v-model="addedConstructor.longname"
        label="Nombre largo"
        placeholder="Nombre largo"
        name="longname"
      />
      <PInput
        v-model="addedConstructor.carname"
        label="Nombre del coche"
        placeholder="Nombre del coche"
        name="carname"
      />
      <PInput
        v-model="addedConstructor.color"
        label="Color del equipo"
        placeholder="Color del equipo"
        name="color"
        type="color"
      />

      <PButton
        class="mt-4"
        :disabled="!isDataOk()"
        type="solid"
        label="Crear constructor"
        @click="addConstructorToSeason()"
      />
    </form>

    {{ addedConstructor }}
  </PCard>
</template>

<script setup lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import {constructorService, grandPrixService, notificationService, seasonService} from "@/_services";

import {onMounted, ref} from "vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import {useRoute, useRouter} from "vue-router";
import PCard from "@/components/lib/PCard.vue";
import PSelect from "@/components/lib/forms/PSelect.vue";
import {Season} from "@/types/Season";
import Loading from "@/components/lib/Loading.vue";
import {Constructor} from "@/types/Constructor";

const router = useRouter();
const route = useRoute();

const isLoading = ref(true);
const season = ref({} as Season);
const constructorsList = ref([] as Array<Constructor>);
const addedConstructor = ref({
  id: 0,
  longname: '',
  carname: '',
  color: ''
})

onMounted(async () => {
  try {
    const [seasonResponse, constructorsListResponse] = await Promise.all([
      seasonService.getSeason(route.params.season as string),
      constructorService.getAllConstructors()
    ])

    season.value = seasonResponse;
    constructorsList.value = constructorsListResponse;

    console.log('season', season)
    console.log('list', constructorsList)
    isLoading.value = false;
  } catch (e) {

  }
});

const isDataOk = (): boolean => {
  return !!(addedConstructor.value.id && addedConstructor.value.longname && addedConstructor.value.carname && addedConstructor.value.color)
};

const addConstructorToSeason = async () => {
  const seasonId = route.params.season.toString()
  console.log('addedConstructor', addedConstructor.value)
  console.log('season', season)

  const rawData = {
    constructor: addedConstructor.value.id,
    car: addedConstructor.value.carname,
    fullname: addedConstructor.value.longname,
    teamcolor: addedConstructor.value.color,
  }

  try {
    const result = await constructorService.linkConstructorToSeason(seasonId, rawData)
    notificationService.showNotification("Se ha añadido correctamente el  constructor `" + result.name + "`");

    router.push({
      name: 'adminConstructorsInSeason'
    })
  } catch (error: any) {
    notificationService.showNotification(error.message, "error");
  }
}
</script>
