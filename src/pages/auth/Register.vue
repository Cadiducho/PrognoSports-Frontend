<template>
  <div class="py-6">
    <PContainer size="sm">
      <PCard title="Registro en PrognoSports">
        <form @submit.prevent="handleSubmit()">
          <PInput
            v-model="form.email"
            label="Correo electrónico"
            icon="fas fa-at"
            type="email"
            required
            :error="form.submitted && !form.email"
          />
          <PInput
            v-model="form.username"
            label="Nombre de usuario"
            icon="fas fa-user"
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
          <PCheckbox
            v-model="form.tos"
            class="mb-4 select-none"
          >
            Acepto los <a
              class="text-brand-600 hover:underline dark:text-brand-300"
              href="/terms"
              target="_blank"
            >términos de servicio</a> y las <a
              class="text-brand-600 hover:underline dark:text-brand-300"
              href="/privacy"
              target="_blank"
            >políticas de privacidad</a>.
          </PCheckbox>
          <PButton
            native-type="submit"
            expanded
            :disabled="!form.tos || form.isRegistering"
          >
            Regístrate
          </PButton>
        </form>
        <template #footer>
          <PCardFooterItem :to="{ name: 'login', query: { redirect: redirectTo }}">
            Ya tengo usuario
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
defineOptions({ name: 'RegisterPage' });

import {useAuthStore} from "@/store/authStore";
import {notificationService} from "@/_services";
import {reactive} from "vue";
import {LocationQueryValue, useRoute, useRouter} from "vue-router";
import PButton from "@/components/lib/forms/PButton.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import PCheckbox from "@/components/lib/forms/PCheckbox.vue";
import PCard from "@/components/lib/PCard.vue";
import PContainer from "@/components/lib/PContainer.vue";
import PCardFooterItem from "@/components/lib/PCardFooterItem.vue";

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
