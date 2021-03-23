<template>
    <div id="loginComponent">
        <LandingNavbar />
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
                            <form>
                                <div class="field">
                                    <label class="label">Usuario</label>
                                    <div
                                        class="control has-icons-left has-icons-right"
                                    >
                                        <input
                                            v-model="username"
                                            id="username"
                                            autofocus
                                            required
                                            class="input"
                                            :class="{
                                                'is-danger':
                                                    submitted && !username,
                                            }"
                                            type="text"
                                            name="username"
                                        />
                                        <span class="icon is-small is-left">
                                            <i class="fas fa-user"></i>
                                        </span>
                                    </div>
                                </div>
                                <div class="field">
                                    <label class="label">Contraseña</label>
                                    <div
                                        class="control has-icons-left has-icons-right"
                                    >
                                        <input
                                            v-model="password"
                                            id="password"
                                            required
                                            class="input"
                                            :class="{
                                                'is-danger':
                                                    submitted && !password,
                                            }"
                                            type="password"
                                            name="password"
                                        />
                                        <span class="icon is-small is-left">
                                            <i class="fas fa-lock"></i>
                                        </span>
                                    </div>
                                </div>
                                <div class="field is-grouped">
                                    <div class="control">
                                        <button
                                            v-on:click.prevent="handleSubmit()"
                                            class="button is-link"
                                        >
                                            Acceder
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
                                <router-link to="/forgotpassword"
                                    >He olvidado mi contraseña</router-link
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
import {namespace} from "vuex-class";
const Auth = namespace("Auth");

@Component({
    components: { LandingNavbar, LandingFooter },
})
export default class Login extends Vue {
    username: string = "";
    password: string = "";
    submitted: boolean = false;

    @Auth.Action private login!: (payload: {username: string, password: string}) => Promise<string>;
    @Auth.State("mail") private registeredMail!: string;

    created() {
        if (!!this.registeredMail) {
            this.username = this.registeredMail;
        }
    }

    public handleSubmit() {
        this.submitted = true;
        if (this.username && this.password) {
            this.login({
                username: this.username,
                password: this.password,
            }).then(
                () => {
                    this.$buefy.toast.open({
                        message: "¡Has iniciado sesión correctamente!",
                        type: "is-success",
                    });

                    this.$router.push({ name: "home" });
                },
                (error: any) => {
                    let message: string;
                    if (error.code === 600) {
                        message = "Fallo al iniciar sesión: Credenciales inválidas";
                    } else {
                        message = "Fallo al iniciar sesión: " + error.message;
                    }

                    this.$buefy.toast.open({
                        duration: 5000,
                        message: message,
                        type: "is-danger",
                    });
                }
            );
        }
    }
}
</script>
