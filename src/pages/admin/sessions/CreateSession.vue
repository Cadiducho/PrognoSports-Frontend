<template>
  <PPage>
    <PInput
      v-model="createdSession.name"
      label="Nombre de la sesión"
      name="name"
    />
    <PInput
      v-model="createdSession.code"
      label="Código corto de la sesión"
      name="code"
    />
    <PSwitch
      v-model="createdSession.hasGrid"
      class="mt-4"
      name="hasGrid"
    >
      ¿Tiene parrilla de salida?
    </PSwitch>
    <PSwitch
      v-model="createdSession.hasFastLap"
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
        class="mt-4"
        :disabled="!isDataOk()"
        @click="registerSession"
      >
        Crear sesión
      </PButton>
    </div>
  </PPage>
</template>

<script setup lang="ts">
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