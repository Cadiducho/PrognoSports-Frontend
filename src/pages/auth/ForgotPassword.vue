<template>
  <div class="container mt-6 mb-6">
    <div class="ui-grid ui-grid-center">
      <div class="ui-column ui-col-2-5">
        <div class="ui-card">
          <div class="ui-card-header">
            <div class="ui-card-title">
              Cambio de contraseña
            </div>
          </div>
          <div class="ui-card-content">
            <div class="ui-content">
              <p class="ui-text-justified">
                Para solicitar un cambio de contraseña,
                deberás introducir el correo electrónico de
                tu cuenta, donde recibirás un código de recuperación.
              </p>
              <p class="ui-text-justified">
                Con dicho código podrás establecer una nueva
                contraseña para tu cuenta.
              </p>
            </div>
            <form
              v-if="form.showChangePasswordForm"
              @submit.prevent="handleSubmitChangePassword()"
            >
              <div class="ui-field">
                <label class="label">Correo electrónico</label>
                <div class="ui-control ui-has-icons-left ui-has-icons-right">
                  <input
                    v-model="form.email"
                    required
                    class="ui-input"
                    type="email"
                  >
                  <span class="ui-icon ui-small ui-icon-left">
                    <i class="fas fa-at" />
                  </span>
                </div>
              </div>
              <div class="ui-field">
                <label class="label">Código de verificación</label>
                <div class="ui-control ui-has-icons-left ui-has-icons-right">
                  <input
                    v-model="form.inputToken"
                    required
                    class="ui-input"
                    type="text"
                  >
                  <span class="ui-icon ui-small ui-icon-left">
                    <i class="fas fa-qrcode" />
                  </span>
                </div>
              </div>
              <div class="ui-field">
                <label class="label">Nueva contraseña</label>
                <div class="ui-control ui-has-icons-left ui-has-icons-right">
                  <input
                    v-model="form.inputPassword"
                    required
                    class="ui-input"
                    type="password"
                  >
                  <span class="ui-icon ui-small ui-icon-left">
                    <i class="fas fa-lock" />
                  </span>
                </div>
              </div>
              <div class="ui-field ui-grouped">
                <div class="ui-control">
                  <p-button
                    native-type="submit"
                    class="ui-button ui-info"
                    :disabled="loading.changePassword || !form.email || !form.inputToken || !form.inputPassword"
                  >
                    Cambiar contraseña
                  </p-button>
                </div>
                <div class="ui-control">
                  <p-button
                    type="soft"
                    color="teal"
                    @click="form.showChangePasswordForm = false"
                  >
                    Enviar nuevo código
                  </p-button>
                </div>
              </div>
            </form>

            <form
              v-else
              @submit.prevent="handleSendCode()"
            >
              <div class="ui-field">
                <label class="label">Correo electrónico</label>
                <div class="ui-control ui-has-icons-left ui-has-icons-right">
                  <input
                    v-model="form.email"
                    required
                    class="ui-input"
                    type="email"
                  >
                  <span class="ui-icon ui-small ui-icon-left">
                    <i class="fas fa-at" />
                  </span>
                </div>
              </div>
              <div class="ui-field ui-grouped">
                <div class="ui-control">
                  <p-button
                    native-type="submit"
                    class="ui-button ui-info"
                    :disabled="loading.sendCode || !form.email"
                  >
                    Solicitar código
                  </p-button>
                </div>
                <div class="ui-control">
                  <p-button
                    type="soft"
                    color="teal"
                    @click="form.showChangePasswordForm = true"
                  >
                    Ya tengo un código
                  </p-button>
                </div>
              </div>
            </form>
          </div>
          <div class="ui-card-footer">
            <div class="ui-card-footer-item">
              <router-link :to="{ name: 'register', query: { redirect: redirectTo }}">
                Registrarse
              </router-link>
            </div>
            <div class="ui-card-footer-item">
              <router-link :to="{ name: 'login', query: { redirect: redirectTo }}">
                Ya tengo usuario
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {LocationQueryValue, useRoute, useRouter} from "vue-router";
import {reactive} from "vue";
import {notificationService, userService} from "@/_services";
import PButton from "@/components/lib/forms/PButton.vue";

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
