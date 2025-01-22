<template>
  <div class="container mt-6 mb-6">
    <div class="columns is-centered">
      <div class="column is-two-fifths">
        <div class="card">
          <div class="card-header">
            <div class="card-header-title">
              Registro en PrognoSports
            </div>
          </div>
          <div class="card-content">
            <form @submit.prevent="handleSubmit()">
              <div class="field">
                <label class="label">Correo electrónico</label>
                <div class="control has-icons-left has-icons-right">
                  <span class="icon is-small is-left">
                    <i class="fas fa-at" />
                  </span>

                  <input
                    v-model="form.email"
                    type="email"
                    required
                    class="input"
                    :class="{ 'is-danger': form.submitted && !form.email }"
                  >
                </div>
              </div>
              <div class="field">
                <label class="label">Nombre de usuario</label>
                <div class="control has-icons-left has-icons-right">
                  <span class="icon is-small is-left">
                    <i class="fas fa-user" />
                  </span>

                  <input
                    v-model="form.username"
                    type="text"
                    autofocus
                    required
                    class="input"
                    :class="{ 'is-danger': form.submitted && !form.username }"
                  >
                </div>
              </div>
              <div class="field">
                <label class="label">Contraseña</label>
                <div class="control has-icons-left has-icons-right">
                  <span class="icon is-small is-left">
                    <i class="fas fa-lock" />
                  </span>

                  <input
                    v-model="form.password"
                    type="password"
                    required
                    class="input"
                    :class="{ 'is-danger': form.submitted && !form.password }"
                  >
                </div>
              </div>
              <div class="field">
                <label class="checkbox">
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
              <div class="field is-grouped">
                <div class="control">
                  <button
                    :disabled="!form.tos || form.isRegistering"
                    class="button is-link"
                  >
                    Regístrate
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div class="card-footer">
            <div class="card-footer-item">
              <router-link :to="{ name: 'login', query: { redirect: redirectTo }}">
                Ya tengo usuario
              </router-link>
            </div>
            <div class="card-footer-item">
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
import {useAuthStore} from "@/store/authStore";
import {notificationService} from "@/_services";
import {reactive} from "vue";
import {LocationQueryValue, useRoute, useRouter} from "vue-router";

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
