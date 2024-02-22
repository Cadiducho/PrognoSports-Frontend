<template>
    <div id="createSession" class="box">
        <PrognoPageTitle class="mb-5" name="Crear sesión"/>

        <PInput label="Nombre de la sesión" name="name" v-model="createdSession.name" />
        <PInput label="Código corto de la sesión" name="code" v-model="createdSession.code" />
        <PSwitch class="mt-4" label="¿Tiene parrilla de salida?" name="hasGrid" v-model="createdSession.hasGrid" />
        <PSwitch class="mt-4" label="¿Admite vueltas rápidas?" name="hasFastLap" v-model="createdSession.hasFastLap" />

        <PButton class="mt-4" :disabled="!isDataOk()" @click="registerSession" type="solid" label="Crear sesión" />

    </div>
</template>

<script setup lang="ts">
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import {notificationService, sessionService} from "@/_services";

import {reactive} from "vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import {useRouter} from "vue-router";
import PSwitch from "@/components/lib/forms/PSwitch.vue";

const router = useRouter();

const createdSession = reactive({
    name: '',
    code: '',
    hasGrid: false,
    hasFastLap: false,
});

const isDataOk = (): boolean => {
    return ((createdSession.name.length > 0) && (createdSession.code.length > 0 && createdSession.code.length < 4))
}
const registerSession = async () =>  {
    let rawSession = {
        name: createdSession.name,
        code: createdSession.code,
        hasGrid: createdSession.hasGrid,
        hasFastLap: createdSession.hasFastLap
    }

    try {
        const result = await sessionService.createSession(rawSession);
        notificationService.showNotification("Se ha registrado correctamente la sesión `" + result.name + "`");

        router.push({
            name: 'adminSessions'
        })
    } catch (error: any) {
        notificationService.showNotification(error.message, "error");
    }
}
</script>