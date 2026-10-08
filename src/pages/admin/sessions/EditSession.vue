<template>
  <PPage>
    <PInput
      v-model="editedSession.name"
      label="Nombre de la sesión"
      name="name"
    />
    <PInput
      v-model="editedSession.code"
      label="Código corto de la sesión"
      name="code"
    />
    <PSwitch
      v-model="editedSession.hasGrid"
      class="mt-4"
      name="hasGrid"
    >
      ¿Tiene parrilla de salida?
    </PSwitch>
    <PSwitch
      v-model="editedSession.hasFastLap"
      class="mt-4"
      name="hasFastLap"
    >
      ¿Admite vueltas rápidas?
    </PSwitch>

    <div class="flex mt-4">
      <PButton
        color="danger"
        type="soft"
        class="me-4"
        @click="router.push({name: 'adminSessions'})"
      >
        Cancelar
      </PButton>
      <PButton
        :disabled="!isDataOk()"
        @click="editSession"
      >
        Editar sesión
      </PButton>
    </div>
  </PPage>
</template>

<script setup lang="ts">
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