<template>
  <div
    id="createCircuit"
    class="box"
  >
    <PTitle
      class="mb-5"
      name="Crear circuito"
    />

    <PInput
      v-model="rawCircuit.name"
      label="Nombre del circuito"
      name="name"
    />
    <PInput
      v-model="rawCircuit.locality"
      label="Localidad del circuito"
      name="locality"
    />
    <PInput
      v-model="rawCircuit.country"
      label="País del circuito"
      name="country"
    />
    <PInput
      v-model="rawCircuit.latitude"
      label="Latitud del circuito"
      name="latitude"
      type="number"
    />
    <PInput
      v-model="rawCircuit.longitude"
      label="Longitud del circuito"
      name="longitude"
      type="number"
    />

    <PrognoAlert message="Deberás rellenar más datos en la edición del circuito." />

    <PButton
      block
      label="Crear circuito"
      variant="primary"
      @click="createCircuit()"
    />
  </div>
</template>

<script setup lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import {circuitService, notificationService} from "@/_services";

import {reactive} from "vue";
import PInput from "@/components/lib/forms/PInput.vue";
import {useRouter} from "vue-router";
import PButton from "@/components/lib/forms/PButton.vue";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";

const router = useRouter();

const rawCircuit = reactive({
    name: '',
    locality: '',
    country: '',
    latitude: 0,
    longitude: 0,
})

const isDataOk = (): boolean => {
    if (!rawCircuit.name) {
        notificationService.showNotification("El circuito debe de tener Nombre", "error");
        return false;
    }
    if (!rawCircuit.locality) {
        notificationService.showNotification("El circuito debe de tener Localidad", "error");
        return false;
    }
    if (!rawCircuit.country) {
        notificationService.showNotification("El circuito debe de tener País", "error");
        return false;
    }
    if (!rawCircuit.latitude) {
        notificationService.showNotification("El circuito debe de tener coordenada de Latitud", "error");
        return false;
    }
    if (!rawCircuit.longitude) {
        notificationService.showNotification("El circuito debe de tener coordenada de Longitud", "error");
        return false;
    }
    return true;
}

const createCircuit = async () => {
    if (!isDataOk()) {
        return;
    }

    // Se envia el circuito, con los datos por defecto para una variante GP que la API también creará
    try {
        const result = await circuitService.createCircuit(rawCircuit);

        notificationService.showNotification("Se ha registrado correctamente el circuito `" + result.name + "`");

        await router.push({
            name: 'adminCircuitEdit',
            params: {
                circuit: result.id,
            }
        })
    } catch (error: any) {
        notificationService.showNotification(error.message, "error");
    }
}
</script>
