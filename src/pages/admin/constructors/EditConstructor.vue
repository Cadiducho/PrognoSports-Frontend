<template>
    <loading v-if="isLoading"/>
    <div v-if="constructor.id" id="editConstrcutor" class="box">
        <PrognoPageTitle class="mb-5" name="Editar constructor"/>

        <PInput label="Nombre del constructor" name="name" v-model="constructor.name" />

        <PButton class="mt-4" @click="editConstructor" type="solid" label="Editar constructor" />
    </div>
    <div v-else>
        <p>El constructor no ha sido encontrado</p>
    </div>
</template>

<script setup lang="ts">

import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import {onMounted, ref} from "vue";
import {constructorService, notificationService} from "@/_services";
import {useRoute, useRouter} from "vue-router";
import Loading from "@/components/lib/Loading.vue";

const router = useRouter();
const route = useRoute();

const isLoading = ref(true);

const constructor = ref({
    id: 0,
    name: ''
});

onMounted(() => {
    if (!route.params.constructorId) {
        isLoading.value = false;
        return;
    }
    constructorService.getConstructor(route.params.constructorId as string)
        .then(response => {
            constructor.value = response;
        })
        .catch((e) => {
            console.error(e);
        }).finally(() => {
            isLoading.value = false;
        });
})

const editConstructor = async () => {
    if (!constructor.value.name) {
        return;
    }
    try {
        const updated = await constructorService.updateConstructor(constructor.value);
        if (updated) {
            notificationService.showNotification("Se ha actualizado correctamente el Constructor `" + constructor.value.name + "`", "success");

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