<template>
    <div id="forgotPasswordComponent">
        <LandingNavbar />
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
                                    tu cuenta, donde recibirás un código de
                                    recuperación.
                                </p>
                                <p class="has-text-justified">
                                    Con dicho código podrás establecer una nueva
                                    contraseña para tu cuenta.
                                </p>
                            </div>
                            <form>
                                <div class="field">
                                    <label class="label"
                                        >Correo electrónico</label
                                    >
                                    <div
                                        class="control has-icons-left has-icons-right"
                                    >
                                        <input
                                            v-model="email"
                                            id="email"
                                            required
                                            class="input"
                                            :class="{
                                                'is-danger':
                                                    submitted && !email,
                                            }"
                                            type="email"
                                            name="email"
                                        />
                                        <span class="icon is-small is-left">
                                            <i class="fas fa-at"></i>
                                        </span>
                                    </div>
                                </div>
                                <div class="field is-grouped">
                                    <div class="control">
                                        <button
                                            v-on:click.prevent="handleSubmit()"
                                            class="button is-link"
                                        >
                                            Solicitar
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="card-footer">
                            <div class="card-footer-item">
                                <router-link to="/register"
                                    >Registrarse</router-link
                                >
                            </div>
                            <div class="card-footer-item">
                                <router-link to="/login"
                                    >Ya tengo usuario</router-link
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <LandingFooter/>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LandingNavbar from "@/components/landing/LandingNavbar.vue";
import LandingFooter from "@/components/landing/LandingFooter.vue";
import {userService} from "@/_services";

@Component({
    components: { LandingNavbar, LandingFooter },
})
export default class ForgotPassword extends Vue {
    private email: string = "";
    private inputToken: string = "";
    private inputPassword: string = "";
    private showChangePassword: boolean = false;

    handleSubmit(e: any) {
        if (!this.showChangePassword) {
            const { email } = this;
            if (email) {
                userService.sendForgotPassword(email).then(
                    () => {
                        this.$buefy.toast.open({
                            message:
                                "Tu código de verificación ha sido enviado",
                            type: "is-success",
                        });
                        this.showChangePassword = true;
                    },
                    (error) => {
                        if (error === "User email cannot be null") {
                            this.$buefy.toast.open({
                                duration: 5000,
                                message:
                                    "Debes introducir tu dirección de email",
                                type: "is-danger",
                            });
                        } else if (error === "User not found") {
                            this.$buefy.toast.open({
                                duration: 5000,
                                message: "Usuario no encontrado",
                                type: "is-danger",
                            });
                        }
                    }
                );
            }
        } else {
            const { email, inputToken, inputPassword } = this;
            if (email) {
                userService.changePassword(
                    email,
                    inputToken,
                    inputPassword
                ).then(
                    () => {
                        this.$buefy.toast.open({
                            message: "Tu contraseña ha sido restablecida",
                            type: "is-success",
                        });
                        this.$router.push("/login");
                    },
                    (error) => {
                        if (error === "User email cannot be null") {
                            this.$buefy.toast.open({
                                duration: 5000,
                                message:
                                    "Debes introducir tu dirección de email",
                                type: "is-danger",
                            });
                        } else if (error === "User not found") {
                            this.$buefy.toast.open({
                                duration: 5000,
                                message: "Usuario no encontrado",
                                type: "is-danger",
                            });
                        } else if (
                            error === "You must send the security token"
                        ) {
                            this.$buefy.toast.open({
                                duration: 5000,
                                message:
                                    "Debes escribir el código de seguridad recibido",
                                type: "is-danger",
                            });
                        } else if (error === "You must send new the password") {
                            this.$buefy.toast.open({
                                duration: 5000,
                                message: "Debes escribir tu nueva contraseña",
                                type: "is-danger",
                            });
                        } else if (error === "Token rejected") {
                            this.$buefy.toast.open({
                                duration: 5000,
                                message:
                                    "Token rechazado. Compruebalo bien o vuelve a intentarlo en 15 minutos",
                                type: "is-danger",
                            });
                        }
                    }
                );
            }
        }
    }
}
</script>