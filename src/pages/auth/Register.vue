<template>
  <div class="container mx-auto my-6 w-full px-4 sm:px-6">
    <div class="ui-grid ui-grid-center">
      <div class="ui-column ui-col-2-5">
        <div class="ui-card">
          <div class="ui-card-header">
            <div class="ui-card-title">
              Registro en PrognoSports
            </div>
          </div>
          <div class="ui-card-content">
            <form @submit.prevent="handleSubmit()">
              <div class="ui-field">
                <label class="ui-label">Correo electrónico</label>
                <div class="ui-control ui-has-icons-left ui-has-icons-right">
                  <span class="ui-icon ui-small ui-icon-left">
                    <i class="fas fa-at" />
                  </span>

                  <input
                    v-model="form.email"
                    type="email"
                    required
                    class="ui-input"
                    :class="{ 'ui-input-error': form.submitted && !form.email }"
                  >
                </div>
              </div>
              <div class="ui-field">
                <label class="ui-label">Nombre de usuario</label>
                <div class="ui-control ui-has-icons-left ui-has-icons-right">
                  <span class="ui-icon ui-small ui-icon-left">
                    <i class="fas fa-user" />
                  </span>

                  <input
                    v-model="form.username"
                    type="text"
                    autofocus
                    required
                    class="ui-input"
                    :class="{ 'ui-input-error': form.submitted && !form.username }"
                  >
                </div>
              </div>
              <div class="ui-field">
                <label class="ui-label">Contraseña</label>
                <div class="ui-control ui-has-icons-left ui-has-icons-right">
                  <span class="ui-icon ui-small ui-icon-left">
                    <i class="fas fa-lock" />
                  </span>

                  <input
                    v-model="form.password"
                    type="password"
                    required
                    class="ui-input"
                    :class="{ 'ui-input-error': form.submitted && !form.password }"
                  >
                </div>
              </div>
              <div class="ui-field">
                <label class="ui-checkbox select-none">
                  <input
                    v-model="form.tos"
                    type="checkbox"
                    required
                  >
                  Acepto los <a
                    href="/terms"
                    target="_blank"
                  >términos de servicio</a> y las <a
                    href="/privacy"
                    target="_blank"
                  >políticas de privacidad</a>.
                </label>
              </div>
              <div class="ui-field ui-grouped">
                <div class="ui-control">
                  <p-button
                    native-type="submit"
                    :disabled="!form.tos || form.isRegistering"
                  >
                    Regístrate
                  </p-button>
                </div>
              </div>
            </form>
          </div>
          <div class="ui-card-footer">
            <div class="ui-card-footer-item">
              <router-link :to="{ name: 'login', query: { redirect: redirectTo }}">
                Ya tengo usuario
              </router-link>
            </div>
            <div class="ui-card-footer-item">
              <router-link :to="{ name: 'forgotpassword', query: { redirect: redirectTo }}">
                He olvidado mi contraseña
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'RegisterPage' });

import {useAuthStore} from "@/store/authStore";
import {notificationService} from "@/_services";
import {reactive} from "vue";
import {LocationQueryValue, useRoute, useRouter} from "vue-router";
import PButton from "@/components/lib/forms/PButton.vue";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const redirectTo = route.query.redirect as LocationQueryValue;
const form = reactive({
  email: "",
  username: "",
  password: "",
  tos: false,
  submitted: false,
  isRegistering: false,
});

const handleSubmit = async () => {
  // Prevenir multiples clicks en register
  if (form.isRegistering || !(form.email && form.username && form.password) || !form.tos) {
    return;
  }

  form.submitted = true;
  form.isRegistering = true;

  try {
    await authStore.register({
      email: form.email,
      username: form.username,
      password: form.password,
    });
    router.push({
      path: '/login',
      query: {redirect: redirectTo}
    });
    notificationService.showNotification("Te has registrado con éxito");
  } catch (error: any) {
    notificationService.showNotification(error.message, "error");
    console.error(error);
    form.isRegistering = false;
  }
}
</script>
