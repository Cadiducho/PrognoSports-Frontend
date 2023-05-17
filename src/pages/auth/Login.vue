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

                                    <input v-model="username" type="text" autofocus required
                                        class="input" :class="{ 'is-danger': submitted && !username }" />

                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Contraseña</label>
                                <div class="control has-icons-left has-icons-right">
                                    <span class="icon is-small">
                                        <i class="fas fa-lock"></i>
                                    </span>

                                    <input v-model="password" type="password" required
                                        class="input" :class="{ 'is-danger': submitted && !password }" />

                                </div>
                            </div>
                            <div class="field is-grouped">
                                <div class="control">
                                    <button type="submit" class="button is-link" :disabled="isLoggingIn">
                                        Acceder
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="card-footer">
                        <div class="card-footer-item">
                            <router-link :to="{ name: 'register', query: { redirect: this.$route.query.redirect }}">Registrarse</router-link>
                        </div>
                        <div class="card-footer-item">
                            <router-link :to="{ name: 'forgotpassword', query: { redirect: this.$route.query.redirect }}">He olvidado mi contraseña</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import {notificationService} from "@/_services";

export default defineComponent({
    name: "Login",
    setup() {
        const authStore = useAuthStore();

        const login = authStore.login;
        const registeredMail = authStore.mail;
        return { login, registeredMail }
    },
    data() {
        return {
            username: "",
            password: "",
            submitted: false,
            isLoggingIn: false,
            redirectTo: this.$route.query.redirect
        }
    },
    created() {
        if (!!this.registeredMail) {
            this.username = this.registeredMail;
        }
    },
    methods: {
        handleSubmit() {
            // Prevenir multiples clicks en el login
            if (this.isLoggingIn) return;

            this.submitted = true;
            this.isLoggingIn = true;
            if (this.username && this.password) {
                this.login({
                    username: this.username,
                    password: this.password,
                }).then(
                    () => {
                        notificationService.showNotification("¡Has iniciado sesión correctamente!");

                        if (this.redirectTo !== undefined) {
                            // Enviar a la redirección
                            this.$router.push(this.redirectTo as string);
                        } else {
                            // Redirigir al home en caso normal
                            this.$router.push({name: "home"});
                        }
                    },
                    (error: any) => {
                        let message: string;
                        if (error.code === 600) {
                            message = "Fallo al iniciar sesión: Credenciales inválidas";
                        } else {
                            message = "Fallo al iniciar sesión: " + error.message;
                        }
                        this.isLoggingIn = false;

                        notificationService.showNotification(message, 'error');
                    }
                );
            }
        }
    }
});
</script>
