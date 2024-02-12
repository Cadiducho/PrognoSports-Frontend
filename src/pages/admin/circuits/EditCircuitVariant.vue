<template>
    <article class="w-full p-4">
        <div class="block bg-white overflow-hidden text-gray-700">
            <div class="flex justify-between">
                <h3 class="mt-2 mb-2 font-bold text-xl">
                    {{ variant.name }} # ID: {{ variant.id }}
                </h3>
                <PButton class="mr-2" pilled type="soft" size="small" color="red" label="Eliminar"
                         @click="removeVariant()"
                />
            </div>
            <p-input label="Nombre de la variante" name="name" v-model="variant.name"/>
            <p-input label="Distancia en kilómetros" name="distance" type="number" v-model="variant.distance"/>
            <p-input label="Número de curvas" name="turns" type="number" v-model="variant.turns"/>

            <PButton type="ghost" size="small" :label="(variant.hasLayoutImage ? 'Editar' : 'Agregar') + ' imagen layout'" />
            <input type="file" @change="onFileChange" class="block w-full text-sm text-slate-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-violet-50 file:text-violet-700
                          hover:file:bg-violet-100
                        "/>

            <img v-if="variant.hasLayoutImage" :src="variant.layoutImage()" class="h-48" alt="Variant layout">

        </div>
    </article>
</template>

<script setup lang="ts">
import {CircuitVariant} from "@/types/CircuitVariant";
import PInput from "@/components/lib/forms/PInput.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import {ref} from "vue";
import UploadFileModal from "@/components/lib/UploadFileModal.vue";

const emit = defineEmits<{
    removeVariant: [variant: CircuitVariant]
}>();
const variant = defineModel('variant', { required: true, type: CircuitVariant })

const removeVariant = () => {
    emit('removeVariant', variant.value);
}

const onFileChange = (e: any) => {
    let file = e.target.files[0];
    if (file) {
        variant.value!.temporalLayoutImage = file
    }
}
</script>