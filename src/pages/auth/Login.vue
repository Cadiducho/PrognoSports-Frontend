<template>
    <div class="container mt-6 mb-6">
        <div class="columns is-centered">
            <div class="column is-two-fifths">
                <div class="card">
                    <div class="card-header">
                        <div class="card-header-title">
                            Datos de inicio de sesión
                        </div>
                    </div>
                    <div class="card-content">
                        <form @submit.prevent="handleSubmit()">
                            <div class="field">
                                <label class="label">Usuario</label>
                                <div class="control has-icons-left has-icons-right">

                                    <span class="icon is-small">
                                        <i class="fas fa-user"></i>
                                    </span>

                                    <input v-model="form.username" type="text" autofocus required
                                        class="input" :class="{ 'is-danger': form.submitted && !form.username }" />

                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Contraseña</label>
                                <div class="control has-icons-left has-icons-right">
                                    <span class="icon is-small">
                                        <i class="fas fa-lock"></i>
                                    </span>

                                    <input v-model="form.password" type="password" required
                                        class="input" :class="{ 'is-danger': form.submitted && !form.password }" />

                                </div>
                            </div>
                            <div class="field is-grouped">
                                <div class="control">
                                    <button type="submit" class="button is-link" :disabled="form.isLoggingIn">
                                        Acceder
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="card-footer">
                        <div class="card-footer-item">
                            <router-link :to="{ name: 'register', query: { redirect: redirectTo }}">Registrarse</router-link>
                        </div>
                        <div class="card-footer-item">
                            <router-link :to="{ name: 'forgotpassword', query: { redirect: redirectTo }}">He olvidado mi contraseña</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/authStore";
import { LocationQueryValue, useRoute } from "vue-router";
import { onMounted, reactive } from "vue";
import { useAuth } from "@/composables/useAuth";

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
    if (!!registeredMail) {
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
