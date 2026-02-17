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
        v-model="addedConstructor.constructorId"
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
        v-model="addedConstructor.fullname"
        label="Nombre largo"
        placeholder="Nombre largo"
        name="longname"
      />
      <PInput
        v-model="addedConstructor.car"
        label="Nombre del coche"
        placeholder="Nombre del coche"
        name="carname"
      />
      <PField
        label="Color del equipo"
        required
      >
        <ColorPicker
          v-model="addedConstructor.teamcolor"
          required
        />
      </PField>

      <PButton
        class="mt-4"
        :disabled="!isFormValid"
        type="solid"
        label="Agregar constructor a la temporada"
        @click="addConstructorToSeason()"
      />
    </form>
  </PCard>
</template>

<script setup lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import {constructorService, notificationService, seasonService} from "@/_services";

import {computed, onMounted, ref} from "vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import {useRoute, useRouter} from "vue-router";
import PCard from "@/components/lib/PCard.vue";
import PSelect from "@/components/lib/forms/PSelect.vue";
import {Season} from "@/types/Season";
import Loading from "@/components/lib/Loading.vue";
import {Constructor} from "@/types/Constructor";
import ColorPicker from "@/components/lib/forms/ColorPicker.vue";
import PField from "@/components/lib/forms/PField.vue";

const router = useRouter();
const route = useRoute();

const isLoading = ref(true);
const season = ref({} as Season);
const constructorsList = ref([] as Array<Constructor>);
const addedConstructor = ref({
  constructorId: 0,
  fullname: '',
  car: '',
  teamcolor: ''
})

onMounted(async () => {
  try {
    const [seasonResponse, constructorsListResponse] = await Promise.all([
      seasonService.getSeason(route.params.season as string),
      constructorService.getAllConstructors()
    ])

    season.value = seasonResponse;
    constructorsList.value = constructorsListResponse
    isLoading.value = false;
  } catch (e) {
    console.error(e);
  }
});

const isFormValid = computed(() => {
  const colorRegex = /^#?[0-9A-Fa-f]{6}$/;
  return (
    addedConstructor.value.constructorId > 0 &&
    addedConstructor.value.fullname.trim().length > 0 &&
    addedConstructor.value.car.trim().length > 0 &&
    colorRegex.test(addedConstructor.value.teamcolor)
  );
});

const addConstructorToSeason = async () => {
  const seasonId = route.params.season.toString()
  try {
    const result = await constructorService.linkConstructorToSeason(seasonId, addedConstructor.value)
    notificationService.showNotification("Se ha añadido correctamente el  constructor `" + result.name + "`");

    router.push({
      name: 'adminConstructorsInSeason'
    })
  } catch (error: any) {
    console.error(error);
    notificationService.showNotification(error.message, "error");
  }
}
</script>
