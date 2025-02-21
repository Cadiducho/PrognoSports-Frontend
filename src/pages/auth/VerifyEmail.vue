<template>
  <div class="flex flex-col items-center justify-center min-h-fit">
    <PTitle
      name="Verifica tu email"
      class="text-2xl font-bold mb-4"
    />
    <PCard class="p-6 bg-white rounded-lg shadow-md">
      <p class="text-gray-700 dark:text-gray-300">
        Hemos enviado un email a tu dirección de correo electrónico. Por favor, introduce el código para verificar tu cuenta.
      </p>
      <p-input
        v-model="verificationCode"
        label="Introduce el código de verificación de 6 caracteres"
        class="verification-input"
        :max-lenght="6"
      />
      <p-button
        class="mr-2"
        :disabled="isVerifiying"
        @click="verifyAccount"
      >
        Verificar cuenta
      </p-button>
      <p-button
        color="info"
        type="soft"
        :disabled="showSendVerificationEmail"
        @click="showSendVerificationEmail = true"
      >
        No he recibido mi email de verificación
      </p-button>



      <div v-if="showSendVerificationEmail">
        <hr>

        <p class="mb-2 mt-6 text-gray-700 dark:text-gray-300">
          Si este email no ha llegado a tu bandeja de entrada, por favor, revisa la carpeta de spam. Si necesitas que te enviemos un nuevo correo de verificación, haz click en el siguiente botón.
        </p>
        <PButton
          color="info"
          type="soft"
          class="mt-2"
          :disabled="sended"
          @click="sendVerificationEmail"
        >
          Enviar nuevo correo de verificación
        </PButton>
      </div>
    </PCard>
  </div>
</template>

<script setup lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import PCard from "@/components/lib/PCard.vue";
import PButton from "@/components/lib/forms/PButton.vue";

import {authService, notificationService} from "@/_services";
import {ref} from "vue";
import PInput from "@/components/lib/forms/PInput.vue";
import {useRouter} from "vue-router";
import {useAuthStore} from "@/store/authStore";

const router = useRouter();
const authStore = useAuthStore();

const showSendVerificationEmail = ref(false);
const sended = ref(false);
const sendVerificationEmail = async () => {
  try {
    sended.value = true;
    await authService.requestNewVerificationEmail();
    notificationService.showNotification("Se ha enviado un nuevo correo de verificación a tu dirección de correo electrónico");
  } catch (e) {
    sended.value = false;
    console.error(e);
    notificationService.showNotification("Ha ocurrido un error al enviar el correo de verificación", "error");
  }
}

const isVerifiying = ref(false);
const verificationCode = ref("");
const verifyAccount = async () => {
  try {
    if (verificationCode.value.length !== 6) {
      notificationService.showNotification("El código de verificación debe tener 6 caracteres", "error");
      return;
    }
    isVerifiying.value = true;
    await authService.verifyEmail(verificationCode.value);
    //await authStore.verifyUser();
    await router.push({name: "home"});
    notificationService.showNotification("Tu cuenta ha sido verificada correctamente");
  } catch (e) {
    console.error(e);
    notificationService.showNotification("Ha ocurrido un error al verificar tu cuenta", "error");
  } finally {
    isVerifiying.value = false;
  }
}
</script>

<style scoped>
.verification-input {
  @apply mt-4;
  letter-spacing: 8px;
}
</style>
