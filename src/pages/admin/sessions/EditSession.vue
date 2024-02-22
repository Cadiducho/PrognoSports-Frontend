<template>
    <div id="editSession" class="box">
        <PrognoPageTitle class="mb-5" name="Editar sesión"/>

        <PInput label="Nombre de la sesión" name="name" v-model="editedSession.name" />
        <PInput label="Código corto de la sesión" name="code" v-model="editedSession.code" />
        <PSwitch class="mt-4" label="¿Tiene parrilla de salida?" name="hasGrid" v-model="editedSession.hasGrid" />
        <PSwitch class="mt-4" label="¿Admite vueltas rápidas?" name="hasFastLap" v-model="editedSession.hasFastLap" />

        <PButton class="mt-4" :disabled="!isDataOk()" @click="editSession" type="solid" label="Editar sesión" />

    </div>
</template>

<script setup lang="ts">
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
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