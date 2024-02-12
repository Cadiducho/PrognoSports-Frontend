<template>
    <div id="adminDrivers" class="box">
        <PrognoPageTitle class="mb-5" name="Administración de circuitos"/>

        <loading v-if="isLoading"/>
        <template v-else>

            <p-button class="mb-4" label="Volver a lista de circuitos" color="info" to="/admin/circuits" />

            <p v-if="!thereIsCircuit">El circuito {{ circuitId }} no ha sido encontrada</p>
            <template v-else>

                <div class="flex">
                    <section class="w-1/2 mr-2">
                        <h2 class="title">Datos del circuito</h2>

                        <p-input label="Nombre del circuito" name="name" v-model="circuit!.name"/>
                        <p-input label="Localidad del circuito" name="locality" v-model="circuit!.locality"/>
                        <p-input label="País del circuito" name="country" v-model="circuit!.country"/>
                        <p-input label="Latitud del circuito" name="latitude" type="number" v-model="circuit!.latitude"/>
                        <p-input label="Longitud del circuito" name="longitude" type="number" v-model="circuit!.longitude"/>

                        <PButton type="ghost" size="small" :label="(circuit!.hasLogoImage ? 'Editar' : 'Agregar') + ' imagen de logo'" />
                        <input type="file" @change="onFileChange" class="block w-full text-sm text-slate-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-violet-50 file:text-violet-700
                          hover:file:bg-violet-100
                        "/>

                        <img v-if="circuit?.hasLogoImage" :src="circuit?.logoImage()" class="h-48" alt="Variant layout">
                    </section>

                    <section class="w-1/2 border-l-4">
                        <h2 class="font-bold mb-2 ml-3 text-2xl">Variantes del circuito</h2>
                        <div class="flex flex-wrap">
                            <EditCircuitVariant v-for="variant in circuit?.variants" :variant="variant" @removeVariant="removeVariant($event)" class="last:border-b-0"/>

                            <PButton class="p-2" block label="Agregar una nueva variante" type="soft" color="green" @click="createNewVariant()" />
                        </div>
                    </section>
                </div>



                <PButton block :disabled="!isDataOk()" label="Editar circuito" @click="editCircuit()" variant="primary" />

            </template>
        </template>

    </div>
</template>

<script setup lang="ts">
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import {circuitService, notificationService} from "@/_services";

import {onMounted, ref} from "vue";
import {Circuit} from "@/types/Circuit";
import PButton from "@/components/lib/forms/PButton.vue";
import EditCircuitVariant from "@/pages/admin/circuits/EditCircuitVariant.vue";
import PInput from "@/components/lib/forms/PInput.vue";

import {useRoute, useRouter} from "vue-router";
import {CircuitVariant} from "@/types/CircuitVariant";

const route = useRoute();
const router = useRouter();

const isLoading = ref(true);
const thereIsCircuit = ref(false);
const circuit = ref<Circuit>();
const circuitId = route.params.circuit;

onMounted(() => {
    circuitService.getCircuit(circuitId.toString()).then(response => {
        circuit.value = response;
        thereIsCircuit.value = true;
    }).finally(() => {
        isLoading.value = false;
    })
});

const removeVariant = (variant: CircuitVariant) => {
    const index = circuit.value?.variants.findIndex(cv => cv.id === variant.id);
    if (index) {
        circuit.value?.variants.splice(index, 1);
    }
}
const createNewVariant = () => {
    let newVariantId = 0;
    if (circuit.value?.variants?.length) {
        newVariantId = Math.max(...circuit.value!.variants.map(value => value.id));
    }
    newVariantId++;
    const variant = new CircuitVariant({
        id: newVariantId, circuitId: circuitId.toString(), hasLayoutImage: false,
        name: "Nueva variante", turns: 0, distance: 0
    });
    variant.isNew = true;
    circuit.value!.variants.push(variant);
}

const isDataOk = (): boolean => {
    if (!circuit.value) {
        notificationService.showNotification("Datos inválidos", "error");
        return false;
    }
    if (!circuit.value.variants.length) {
        notificationService.showNotification("El circuito debe de tener al menos una variante", "error");
        return false;
    }
    if (!circuit.value.name) {
        notificationService.showNotification("El circuito debe de tener Nombre", "error");
        return false;
    }
    if (!circuit.value.locality) {
        notificationService.showNotification("El circuito debe de tener Localidad", "error");
        return false;
    }
    if (!circuit.value.country) {
        notificationService.showNotification("El circuito debe de tener País", "error");
        return false;
    }
    if (!circuit.value.latitude) {
        notificationService.showNotification("El circuito debe de tener coordenada de Latitud", "error");
        return false;
    }
    if (!circuit.value.longitude) {
        notificationService.showNotification("El circuito debe de tener coordenada de Longitud", "error");
        return false;
    }
    for (const variant of circuit.value.variants) {
        if (!variant.name) {
            notificationService.showNotification("Las variantes deben de tener nombre", "error");
            return false;
        }
        if (!variant.distance) {
            notificationService.showNotification("Las variantes deben de tener distancia", "error");
            return false;
        }
        if (!variant.turns) {
            notificationService.showNotification("Las variantes deben de tener número de curvas", "error");
            return false;
        }
    }
    return true;
}

const editCircuit = () => {
    if (!isDataOk()) {
        return;
    }
    debugger;

    if (circuit.value?.temporalLogoImage) {
        circuitService.changeCircuitLogo(circuit.value!, circuit.value?.temporalLogoImage)
    }
    circuit.value?.variants.forEach(variant => {
        if (variant.temporalLayoutImage) {
            circuitService.changeVariantLayout(circuit.value!, variant, variant.temporalLayoutImage)
        }
    })

    circuit.value?.variants.forEach(variant => {
        if (variant.isNew) {
            circuitService.createCircuitVariant(circuit.value!, variant);
        } else {
            circuitService.editCircuitVariant(circuit.value!, variant, variant)
        }
    })

    const data = {
        name: circuit.value!.name,
        locality: circuit.value!.locality,
        country: circuit.value!.country,
        latitude: circuit.value!.latitude,
        longitude: circuit.value!.longitude,
    }
    circuitService.editCircuit(circuit.value!, data).then((result) => {
        notificationService.showNotification("Se ha editado correctamente el circuito `" + result.name + "`");

        router.push({
            name: 'adminCircuits'
        })
    }).catch((error) => {
        notificationService.showNotification(error.message, "error");
    });
}

const onFileChange = (e: any) => {
    let file = e.target.files[0];
    if (file) {
        circuit.value!.temporalLogoImage = file;
    }
}

</script>