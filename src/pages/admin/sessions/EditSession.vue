<template>
    <div id="editSession" class="box">
        <PTitle class="mb-5" name="Editar sesión"/>

        <PInput label="Nombre de la sesión" name="name" v-model="editedSession.name" />
        <PInput label="Código corto de la sesión" name="code" v-model="editedSession.code" />
        <PSwitch class="mt-4" name="hasGrid" v-model="editedSession.hasGrid">¿Tiene parrilla de salida?</PSwitch>
        <PSwitch class="mt-4" name="hasFastLap" v-model="editedSession.hasFastLap">¿Admite vueltas rápidas?</PSwitch>

        <div class="flex mt-4">
            <PButton color="danger" type="soft" class="me-4" @click="router.push({name: 'adminSessions'})">Cancelar</PButton>
            <PButton :disabled="!isDataOk()" @click="editSession">Editar sesión</PButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import {notificationService, sessionService} from "@/_services";

import {onMounted, ref} from "vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import {useRouter} from "vue-router";
import PSwitch from "@/components/lib/forms/PSwitch.vue";

const router = useRouter();

const editedSession = ref({
    id: 0,
    name: '',
    code: '',
    hasGrid: false,
    hasFastLap: false,
});

onMounted(async () => {
    const sessionId = router.currentRoute.value.params.session;
    editedSession.value = await sessionService.getSession(sessionId.toString());
});

const isDataOk = (): boolean => {
    return (editedSession.value.id != 0 && editedSession.value.name.length > 0 && (editedSession.value.code.length > 0 && editedSession.value.code.length < 4))
}
const editSession = async () =>  {
    let rawSession = {
        id: editedSession.value.id,
        name: editedSession.value.name,
        code: editedSession.value.code,
        hasGrid: editedSession.value.hasGrid,
        hasFastLap: editedSession.value.hasFastLap
    }

    try {
        const result = await sessionService.updateSession(rawSession);
        notificationService.showNotification("Se ha editado correctamente la sesión `" + result.name + "`");

        router.push({
            name: 'adminSessions'
        })
    } catch (error: any) {
        notificationService.showNotification(error.message, "error");
    }
}
</script>