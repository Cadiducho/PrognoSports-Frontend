<template>
  <div class="flex flex-col items-center justify-center min-h-fit">
    <PTitle
      name="Verifica tu email"
      class="text-2xl font-bold! mb-4"
    />
    <PContainer
      size="sm"
      class="my-6"
    >
      <PCard>
        <p class="text-gray-700 dark:text-gray-300">
          Hemos enviado un email a tu dirección de correo electrónico. Por favor, introduce el código para verificar tu cuenta.
        </p>
        <PInput
          v-model="verificationCode"
          label="Introduce el código de verificación de 6 caracteres"
          class="verification-input"
          :max-lenght="6"
        />
        <PButton
          class="mr-2"
          :disabled="isVerifiying"
          @click="verifyAccount"
        >
          Verificar cuenta
        </PButton>
        <PButton
          color="info"
          type="soft"
          :disabled="showSendVerificationEmail"
          @click="showSendVerificationEmail = true"
        >
          No he recibido mi email de verificación
        </PButton>



        <div v-if="showSendVerificationEmail">
          <hr class="border-gray-200 dark:border-gray-700">

          <p class="mt-6 text-gray-700 dark:text-gray-300 font-bold text-lg">
            Si este email no ha llegado a tu bandeja de entrada, por favor, revisa la carpeta de spam.
          </p>
          <p class="mb-2 text-gray-700 dark:text-gray-300 font-bold text-lg">
            Si necesitas que te enviemos un nuevo correo de verificación, haz click en el siguiente botón.
          </p>
          <PButton
            color="danger"
            class="mt-2"
            :disabled="sended"
            @click="sendVerificationEmail"
          >
            Enviar nuevo correo de verificación
          </PButton>
        </div>
      </PCard>
    </PContainer>
  </div>
</template>

<script setup lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import PCard from "@/components/lib/PCard.vue";
import PContainer from "@/components/lib/PContainer.vue";
import PButton from "@/components/lib/forms/PButton.vue";

import {authService, notificationService} from "@/_services";
import {ref} from "vue";
import PInput from "@/components/lib/forms/PInput.vue";
import {LocationQueryValue, useRoute, useRouter} from "vue-router";
import {useAuthStore} from "@/store/authStore";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const redirectTo = route.query.redirect as LocationQueryValue;
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
    notificationService.showNotification("Tu cuenta ha sido verificada correctamente");

    const target = redirectTo ? (redirectTo as string) : {name: "home"};
    try {
      // El usuario ya no se pide en cada navegación: hay que recargarlo para que el guard de verificación lo deje pasar
      await authStore.loadUser(true);
    } catch (e) {
      // La cuenta ya está verificada. Si no se ha podido recargar el usuario, se recarga la página entera en el destino
      console.error(e);
      window.location.assign(router.resolve(target).href);
      return;
    }
    await router.push(target);
  } catch (e) {
    console.error(e);
    notificationService.showNotification("Ha ocurrido un error al verificar tu cuenta", "error");
  } finally {
    isVerifiying.value = false;
  }
}
</script>

<style scoped>
@reference "@/styles/app.css";

.verification-input {
  @apply mt-4;
  letter-spacing: 8px;
}
</style>
