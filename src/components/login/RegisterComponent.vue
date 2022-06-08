<template>
    <div class="container mt-6 mb-6">
        <div class="columns is-centered">
            <div class="column is-two-fifths">
                <div class="card">
                    <div class="card-header">
                        <div class="card-header-title">Registro en PrognoSports</div>
                    </div>
                    <div class="card-content">
                        <form @submit.prevent="handleSubmit()">
                            <div class="field">
                                <label class="label">Usuario</label>
                                <div class="control has-icons-left has-icons-right">

                                    <span class="icon is-small is-left">
                                        <i class="fas fa-user"></i>
                                    </span>

                                    <input v-model="username" type="text" autofocus required
                                        class="input" :class="{ 'is-danger': submitted && !username }" />
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Contraseña</label>
                                <div class="control has-icons-left has-icons-right">

                                    <span class="icon is-small is-left">
                                        <i class="fas fa-lock"></i>
                                    </span>

                                    <input v-model="password" type="password" required
                                           class="input" :class="{ 'is-danger': submitted && !password }" />

                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Correo electrónico</label>
                                <div class="control has-icons-left has-icons-right">

                                    <span class="icon is-small is-left">
                                        <i class="fas fa-at"></i>
                                    </span>

                                    <input v-model="email" type="email" required
                                        class="input" :class="{ 'is-danger': submitted && !email }" />

                                </div>
                            </div>
                            <div class="field">
                                <label class="checkbox">
                                    <input type="checkbox" v-model="tos" required>
                                    Acepto los <a href="/terms" target="_blank">términos de servicio</a> y las <a href="/privacy" target="_blank">políticas de privacidad</a>.
                                </label>
                            </div>
                            <div class="field is-grouped">
                                <div class="control">
                                    <button :disabled="!tos" class="button is-link">Regístrate</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="card-footer">
                        <div class="card-footer-item">
                            <router-link :to="{ path: '/login', query: { redirect: this.$route.query.redirect }}">Ya tengo usuario</router-link>
                        </div>
                        <div class="card-footer-item">
                            <router-link :to="{ path: '/forgotpassword', query: { redirect: this.$route.query.redirect }}">He olvidado mi contraseña</router-link>
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

export default defineComponent({
    name: "RegisterComponent",
    setup() {
        const authStore = useAuthStore();

        const register = authStore.register;
        return { register };
    },
    data() {
        return {
            email: "",
            username: "",
            password: "",
            tos: false,
            submitted: false,
        }
    },
    methods: {
        handleSubmit() {
            this.submitted = true;
            if (this.email && this.username && this.password) {
                this.register({
                    email: this.email,
                    username: this.username,
                    password: this.password,
                }).then(
                    () => {
                        this.$router.push({
                            path: '/login',
                            query: {redirect: this.$route.query.redirect}
                        });
                        this.$oruga.notification.open({
                            message: "Te has registrado con éxito",
                            variant: "success",
                        });
                    },
                    (error) => {
                        //ToDo: usar los códigos de error, no comparar mensajes
                        if (error === "Email cannot be null") {
                            this.$oruga.notification.open({
                                duration: 5000,
                                message: "Debes introducir una dirección de email",
                                variant: "danger",
                            });
                        } else if (error === "Username cannot be null") {
                            this.$oruga.notification.open({
                                duration: 5000,
                                message: "Debes introducir un nombre de usuario",
                                variant: "danger",
                            });
                        } else if (error === "Password cannot be null") {
                            this.$oruga.notification.open({
                                duration: 5000,
                                message: "Debes introducir una contraseña",
                                variant: "danger",
                            });
                        } else if (error === "Email in use") {
                            this.$oruga.notification.open({
                                duration: 5000,
                                message: "Ya existe un usuario con ese email",
                                variant: "danger",
                            });
                        } else if (error === "Username in use") {
                            this.$oruga.notification.open({
                                duration: 5000,
                                message: "Ya existe un usuario con ese nombre",
                                variant: "danger",
                            });
                        } else if (error === "database error") {
                            this.$oruga.notification.open({
                                duration: 5000,
                                message: "Error inesperado registrando tus datos",
                                variant: "danger",
                            });
                        }
                    }
                );
            }
        }
    }
});
</script>