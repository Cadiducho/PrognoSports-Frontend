<template>
  <div class="py-6">
    <PContainer size="sm">
      <PCard title="Cambio de contraseña">
        <PProse class="mb-4">
          <p>
            Para solicitar un cambio de contraseña,
            deberás introducir el correo electrónico de
            tu cuenta, donde recibirás un código de recuperación.
          </p>
          <p>
            Con dicho código podrás establecer una nueva
            contraseña para tu cuenta.
          </p>
        </PProse>
        <form
          v-if="form.showChangePasswordForm"
          @submit.prevent="handleSubmitChangePassword()"
        >
          <PInput
            v-model="form.email"
            label="Correo electrónico"
            icon="fas fa-at"
            type="email"
            required
          />
          <PInput
            v-model="form.inputToken"
            label="Código de verificación"
            icon="fas fa-qrcode"
            required
          />
          <PInput
            v-model="form.inputPassword"
            label="Nueva contraseña"
            icon="fas fa-lock"
            type="password"
            required
          />
          <div class="mt-2 flex flex-wrap gap-2">
            <PButton
              native-type="submit"
              color="info"
              :disabled="loading.changePassword || !form.email || !form.inputToken || !form.inputPassword"
            >
              Cambiar contraseña
            </PButton>
            <PButton
              type="soft"
              color="teal"
              @click="form.showChangePasswordForm = false"
            >
              Enviar nuevo código
            </PButton>
          </div>
        </form>

        <form
          v-else
          @submit.prevent="handleSendCode()"
        >
          <PInput
            v-model="form.email"
            label="Correo electrónico"
            icon="fas fa-at"
            type="email"
            required
          />
          <div class="mt-2 flex flex-wrap gap-2">
            <PButton
              native-type="submit"
              color="info"
              :disabled="loading.sendCode || !form.email"
            >
              Solicitar código
            </PButton>
            <PButton
              type="soft"
              color="teal"
              @click="form.showChangePasswordForm = true"
            >
              Ya tengo un código
            </PButton>
          </div>
        </form>
        <template #footer>
          <PCardFooterItem :to="{ name: 'register', query: { redirect: redirectTo }}">
            Registrarse
          </PCardFooterItem>
          <PCardFooterItem :to="{ name: 'login', query: { redirect: redirectTo }}">
            Ya tengo usuario
          </PCardFooterItem>
        </template>
      </PCard>
    </PContainer>
  </div>
</template>

<script setup lang="ts">
import {LocationQueryValue, useRoute, useRouter} from "vue-router";
import {reactive} from "vue";
import {notificationService, userService} from "@/_services";
import PButton from "@/components/lib/forms/PButton.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import PCard from "@/components/lib/PCard.vue";
import PContainer from "@/components/lib/PContainer.vue";
import PProse from "@/components/lib/PProse.vue";
import PCardFooterItem from "@/components/lib/PCardFooterItem.vue";

const router = useRouter();
const route = useRoute();

const redirectTo = route.query.redirect as LocationQueryValue;
const form = reactive({
  email: "",
  inputToken: "",
  inputPassword: "",
  showChangePasswordForm: false
})
const loading = reactive({
  sendCode: false,
  changePassword: false
})

const handleSendCode = async () => {
  if (!form.email) {
    return;
  }
  loading.sendCode = true;

  try {
    if (!form.email.trim()) {
      notificationService.showNotification("Debes introducir tu dirección de email", "error");
      return
    }
    await userService.sendForgotPassword(form.email);
    notificationService.showNotification("Si los datos son correctos, recibirás un código de verificación a tu correo electrónico");
    form.showChangePasswordForm = true;
  } catch (error: any) {
    notificationService.showNotification(error.message, "error");
  } finally {
    loading.sendCode = false;
  }
}

const handleSubmitChangePassword = async () => {
  if (!form.email) {
    return;
  }
  loading.changePassword = true;

  const payload = {
    email: form.email,
    token: form.inputToken,
    password: form.inputPassword
  }
  try {
    await userService.changePassword(payload);
    notificationService.showNotification("Si los datos son correctos, tu contraseña habrá sido restablecida");
    router.push({
      path: '/login',
      query: {redirect: redirectTo}
    });
  } catch (error: any) {
    notificationService.showNotification(error.message, "error");
    console.error(error);
  } finally {
    loading.changePassword = false;
  }
};

</script>
