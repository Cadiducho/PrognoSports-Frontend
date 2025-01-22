<template>
    <div id="createCircuit" class="box">
        <PTitle class="mb-5" name="Crear circuito" />

        <p-input label="Nombre del circuito" name="name" v-model="rawCircuit.name"/>
        <p-input label="Localidad del circuito" name="locality" v-model="rawCircuit.locality"/>
        <p-input label="País del circuito" name="country" v-model="rawCircuit.country"/>
        <p-input label="Latitud del circuito" name="latitude" type="number" v-model="rawCircuit.latitude"/>
        <p-input label="Longitud del circuito" name="longitude" type="number" v-model="rawCircuit.longitude"/>

        <PrognoAlert message="Deberás rellenar más datos en la edición del circuito." />

        <PButton block label="Crear circuito" @click="createCircuit()" variant="primary" />
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
