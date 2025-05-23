<template>
  <div class="m-0 w-auto grow mt-2 mb-2 lg:mt-6 lg:mb-6">
    <div class="flex justify-center">
      <div class="flex w-full lg:w-2/5">
        <div class="card w-full">
          <div class="card-header">
            <div class="card-header-title">
              Datos de inicio de sesión
            </div>
          </div>
          <div class="card-content">
            <form @submit.prevent="handleSubmit()">
              <div class="field">
                <label class="label">Email</label>
                <div class="control has-icons-left has-icons-right">
                  <span class="icon is-small">
                    <i class="fas fa-user" />
                  </span>

                  <input
                    v-model="form.username"
                    type="email"
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
                  <span class="icon is-small">
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
              <div class="field is-grouped">
                <div class="control">
                  <p-button
                    native-type="submit"
                    :disabled="form.isLoggingIn"
                  >
                    Acceder
                  </p-button>
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
import {LocationQueryValue, useRoute} from "vue-router";
import {onMounted, reactive} from "vue";
import {useAuth} from "@/composables/useAuth";
import PButton from "@/components/lib/forms/PButton.vue";

const authStore = useAuthStore();
const route = useRoute();
const auth = useAuth();

const redirectTo = route.query.redirect as LocationQueryValue;

const registeredMail = authStore.mail;
const form = reactive({
  username: "",
  password: "",
  submitted: false,
  isLoggingIn: false,
});

onMounted(() => {
  if (registeredMail) {
    form.username = registeredMail;
  }
});

const handleSubmit = async () => {
  // Prevenir multiples clicks en el login
  if (form.isLoggingIn) return;

  form.submitted = true;
  form.isLoggingIn = true;
  if (!(form.username && form.password)) {
    return;
  }

  try {
    const payload = {
      username: form.username,
      password: form.password,
    };
    await auth.login(payload, redirectTo);
  } catch (error: any) {
    form.isLoggingIn = false;
  }
};
</script>
