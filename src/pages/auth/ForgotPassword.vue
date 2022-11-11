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
                        <form @submit.prevent="handleSubmitChangePassword()" v-if="showChangePasswordForm">
                            <div class="field">
                                <label class="label">Correo electrónico</label>
                                <div class="control has-icons-left has-icons-right">
                                    <input v-model="email" required
                                           class="input"
                                           type="email" />
                                    <span class="icon is-small is-left">
                                        <i class="fas fa-at"></i>
                                    </span>
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Código de verificación</label>
                                <div class="control has-icons-left has-icons-right">
                                    <input
                                        v-model="inputToken" required
                                        class="input"
                                        type="text" />
                                    <span class="icon is-small is-left">
                                        <i class="fas fa-qrcode"></i>
                                    </span>
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Nueva contraseña</label>
                                <div class="control has-icons-left has-icons-right">
                                    <input v-model="inputPassword" required
                                           class="input"
                                           type="password" />
                                    <span class="icon is-small is-left">
                                        <i class="fas fa-lock"></i>
                                    </span>
                                </div>
                            </div>
                            <div class="field is-grouped">
                                <div class="control">
                                    <button type="submit" class="button is-link">
                                        Cambiar contraseña
                                    </button>
                                </div>
                                <div class="control">
                                    <button
                                        @click="showChangePasswordForm = false"
                                        class="button is-info">
                                        Enviar nuevo código
                                    </button>
                                </div>
                            </div>
                        </form>

                        <form @submit.prevent="handleSendCode()" v-else>
                            <div class="field">
                                <label class="label">Correo electrónico</label>
                                <div class="control has-icons-left has-icons-right">
                                    <input v-model="email" required
                                           class="input"
                                           type="email" />
                                    <span class="icon is-small is-left">
                                        <i class="fas fa-at"></i>
                                    </span>
                                </div>
                            </div>
                            <div class="field is-grouped">
                                <div class="control">
                                    <button type="submit" class="button is-link">
                                        Solicitar código
                                    </button>
                                </div>
                                <div class="control">
                                    <button
                                        @click="showChangePasswordForm = true"
                                        class="button is-info">
                                        Ya tengo un código
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
                            <router-link :to="{ name: 'login', query: { redirect: this.$route.query.redirect }}">Ya tengo usuario</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {notificationService, userService} from "@/_services";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";

export default defineComponent({
    name: "ForgotPassword",
    setup() {
        const authStore = useAuthStore();
        const communityStore = useCommunityStore();

        const currentUser = authStore.loggedUser;
        const currentCommunity = communityStore.currentCommunity;
        return { currentUser, currentCommunity };
    },
    data() {
        return {
            email: "",
            inputToken: "",
            inputPassword: "",
            showChangePasswordForm: false
        }
    },
    methods: {
        handleSubmitChangePassword() {
            if (this.email) {
                userService.changePassword(
                    this.email,
                    this.inputToken,
                    this.inputPassword
                ).then(
                    () => {
                        notificationService.showNotification("Tu contraseña ha sido restablecida");
                        this.$router.push({
                            path: '/login',
                            query: {redirect: this.$route.query.redirect}
                        });
                    },
                    (error) => {
                        if (error === "User email cannot be null") {
                            notificationService.showNotification("Debes introducir tu dirección de email", "danger");
                        } else if (error === "User not found") {
                            notificationService.showNotification("Usuario no encontrado", "danger");
                        } else if (error === "You must send the security token") {
                            notificationService.showNotification("Debes escribir el código de seguridad recibido", "danger");
                        } else if (error === "You must send new the password") {
                            notificationService.showNotification("Debes escribir tu nueva contraseña", "danger");
                        } else if (error === "Token rejected") {
                            notificationService.showNotification("Token rechazado. Compruebalo bien o vuelve a intentarlo en 15 minutos", "danger");
                        } else {
                            notificationService.showNotification("Ha ocurrido desconocido cambiando la contraseña", "danger");
                            console.log(error);
                        }
                    }
                );
            }
        },
        handleSendCode() {
            if (this.email) {
                userService.sendForgotPassword(this.email).then(
                    () => {
                        notificationService.showNotification("Tu código de verificación ha sido enviado");
                        this.showChangePasswordForm = true;
                    },
                    (error) => {
                        if (error === "User email cannot be null") {
                            notificationService.showNotification("Debes introducir tu dirección de email", "danger");
                        } else if (error === "User not found") {
                            notificationService.showNotification("Usuario no encontrado", "danger");
                        } else {
                            notificationService.showNotification("Ha ocurrido un error solicitando el código", "danger");
                        }
                    }
                );
            }
        }
    }
});
</script>