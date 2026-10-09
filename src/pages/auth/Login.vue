<template>
  <div class="py-6">
    <PContainer size="sm">
      <PCard
        title="Datos de inicio de sesión"
        padding="md"
      >
        <form @submit.prevent="handleSubmit()">
          <PInput
            v-model="form.username"
            label="Email"
            icon="fas fa-user"
            type="email"
            autofocus
            required
            :error="form.submitted && !form.username"
          />
          <PInput
            v-model="form.password"
            label="Contraseña"
            icon="fas fa-lock"
            type="password"
            required
            :error="form.submitted && !form.password"
          />
          <PButton
            native-type="submit"
            class="mt-2"
            expanded
            :disabled="form.isLoggingIn"
          >
            Acceder
          </PButton>
        </form>
        <template #footer>
          <PCardFooterItem :to="{ name: 'register', query: { redirect: redirectTo }}">
            Registrarse
          </PCardFooterItem>
          <PCardFooterItem :to="{ name: 'forgotpassword', query: { redirect: redirectTo }}">
            He olvidado mi contraseña
          </PCardFooterItem>
        </template>
      </PCard>
    </PContainer>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'LoginPage' });

import {useAuthStore} from "@/store/authStore";
import {LocationQueryValue, useRoute} from "vue-router";
import {onMounted, reactive} from "vue";
import {useAuth} from "@/composables/useAuth";
import PButton from "@/components/lib/forms/PButton.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import PCard from "@/components/lib/PCard.vue";
import PContainer from "@/components/lib/PContainer.vue";
import PCardFooterItem from "@/components/lib/PCardFooterItem.vue";

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
  } catch {
    form.isLoggingIn = false;
  }
};
</script>
