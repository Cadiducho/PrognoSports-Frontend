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
                        <form @submit.prevent="handleSubmitChangePassword()" v-if="form.showChangePasswordForm">
                            <div class="field">
                                <label class="label">Correo electrónico</label>
                                <div class="control has-icons-left has-icons-right">
                                    <input v-model="form.email" required
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
                                        v-model="form.inputToken" required
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
                                    <input v-model="form.inputPassword" required
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
                                        @click="form.showChangePasswordForm = false"
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
                                    <input v-model="form.email" required
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
                                        @click="form.showChangePasswordForm = true"
                                        class="button is-info">
                                        Ya tengo un código
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
                            <router-link :to="{ name: 'login', query: { redirect: redirectTo }}">Ya tengo usuario</router-link>
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
        await userService.sendForgotPassword(form.email);
        notificationService.showNotification("Se ha enviado un código de verificación a tu correo electrónico");
        form.showChangePasswordForm = true;
    } catch (error) {
        if (error === "User email cannot be null") {
            notificationService.showNotification("Debes introducir tu dirección de email", "error");
        } else if (error === "User not found") {
            notificationService.showNotification("Usuario no encontrado", "error");
        } else {
            notificationService.showNotification("Ha ocurrido un error solicitando el código", "error");
        }
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
        switch (error.code) {
            case 604:
                notificationService.showNotification("Token rechazado. Compruebalo bien o vuelve a intentarlo en 15 minutos", "error");
                break;
            case 608:
                notificationService.showNotification("Debes introducir el código de seguridad recibido", "error");
                break;
            case 609:
                notificationService.showNotification("Debes introducir tu nueva contraseña", "error");
                break;
            case 710:
                notificationService.showNotification("Debes introducir tu dirección de email", "error");
                break;
            case 708:
                notificationService.showNotification("Usuario no encontrado", "error");
                break;
            default:
                notificationService.showNotification("Ha ocurrido desconocido cambiando la contraseña", "error");
                console.log(error);
                break;
        }
    }
};

</script>