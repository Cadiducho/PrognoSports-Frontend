<template>
  <div class="container mt-6 mb-6">
    <div class="columns is-centered">
      <div class="column is-two-fifths">
        <div class="card">
          <div class="card-header">
            <div class="card-header-title">
              Cambio de contraseña
            </div>
          </div>
          <div class="card-content">
            <div class="content">
              <p class="has-text-justified">
                Para solicitar un cambio de contraseña,
                deberás introducir el correo electrónico de
                tu cuenta, donde recibirás un código de recuperación.
              </p>
              <p class="has-text-justified">
                Con dicho código podrás establecer una nueva
                contraseña para tu cuenta.
              </p>
            </div>
            <form
              v-if="form.showChangePasswordForm"
              @submit.prevent="handleSubmitChangePassword()"
            >
              <div class="field">
                <label class="label">Correo electrónico</label>
                <div class="control has-icons-left has-icons-right">
                  <input
                    v-model="form.email"
                    required
                    class="input"
                    type="email"
                  >
                  <span class="icon is-small is-left">
                    <i class="fas fa-at" />
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Código de verificación</label>
                <div class="control has-icons-left has-icons-right">
                  <input
                    v-model="form.inputToken"
                    required
                    class="input"
                    type="text"
                  >
                  <span class="icon is-small is-left">
                    <i class="fas fa-qrcode" />
                  </span>
                </div>
              </div>
              <div class="field">
                <label class="label">Nueva contraseña</label>
                <div class="control has-icons-left has-icons-right">
                  <input
                    v-model="form.inputPassword"
                    required
                    class="input"
                    type="password"
                  >
                  <span class="icon is-small is-left">
                    <i class="fas fa-lock" />
                  </span>
                </div>
              </div>
              <div class="field is-grouped">
                <div class="control">
                  <button
                    type="submit"
                    class="button is-link"
                  >
                    Cambiar contraseña
                  </button>
                </div>
                <div class="control">
                  <button
                    class="button is-info"
                    @click="form.showChangePasswordForm = false"
                  >
                    Enviar nuevo código
                  </button>
                </div>
              </div>
            </form>

            <form
              v-else
              @submit.prevent="handleSendCode()"
            >
              <div class="field">
                <label class="label">Correo electrónico</label>
                <div class="control has-icons-left has-icons-right">
                  <input
                    v-model="form.email"
                    required
                    class="input"
                    type="email"
                  >
                  <span class="icon is-small is-left">
                    <i class="fas fa-at" />
                  </span>
                </div>
              </div>
              <div class="field is-grouped">
                <div class="control">
                  <button
                    type="submit"
                    class="button is-link"
                  >
                    Solicitar código
                  </button>
                </div>
                <div class="control">
                  <button
                    class="button is-info"
                    @click="form.showChangePasswordForm = true"
                  >
                    Ya tengo un código
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div class="card-footer">
            <div class="card-footer-item">
              <router-link :to="{ name: 'register', query: { redirect: redirectTo }}">
                Registrarse
              </router-link>
            </div>
            <div class="card-footer-item">
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

const router = useRouter();
const route = useRoute();

const redirectTo = route.query.redirect as LocationQueryValue;
const form = reactive({
  email: "",
  inputToken: "",
  inputPassword: "",
  showChangePasswordForm: false
})

const handleSendCode = async () => {
  if (!form.email) {
    return;
  }
  try {
    if (!form.email.trim()) {
      notificationService.showNotification("Debes introducir tu dirección de email", "error");
      return
    }
    await userService.sendForgotPassword(form.email);
    notificationService.showNotification("Se ha enviado un código de verificación a tu correo electrónico");
    form.showChangePasswordForm = true;
  } catch (error: any) {
    notificationService.showNotification(error.message, "error");
  }
}

const handleSubmitChangePassword = async () => {
  if (!form.email) {
    return;
  }

  const payload = {
    email: form.email,
    token: form.inputToken,
    password: form.inputPassword
  }
  try {
    await userService.changePassword(payload);
    notificationService.showNotification("Tu contraseña ha sido restablecida");
    router.push({
      path: '/login',
      query: {redirect: redirectTo}
    });
  } catch (error: any) {
    notificationService.showNotification(error.message, "error");
    console.error(error);
  }
};

</script>
