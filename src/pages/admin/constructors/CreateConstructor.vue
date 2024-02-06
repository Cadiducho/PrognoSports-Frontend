<template>
    <div id="createConstructor" class="box">
        <PrognoPageTitle class="mb-5" name="Crear constructor"/>

        <PInput label="Nombre del constructor" name="name" v-model="name" />

        <PButton class="mt-4" @click="createConstructor" type="solid" label="Crear constructor" />

    </div>
</template>

<script setup lang="ts">

import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import {ref} from "vue";
import {constructorService, notificationService} from "@/_services";
import {useRouter} from "vue-router";

const router = useRouter();
const name = ref('');

const createConstructor = async () => {
    console.log(name.value);
    if (!name.value) {
        return;
    }
    try {
        const created = await constructorService.createConstructor({name: name.value});
        if (created) {
            notificationService.showNotification("Se ha registrado correctamente el Constructor `" + created.name + "`", "success");

            await router.push({
                name: 'adminConstructors'
            });
        }
    } catch (e: any) {
        notificationService.showNotification(e.response.data.message, "error");
        console.error(e.response.data.message);
    }
}
</script>