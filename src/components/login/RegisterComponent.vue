<template>
    <div class="container mt-6 mb-6">
        <div class="columns is-centered">
            <div class="column is-two-fifths">
                <div class="card">
                    <div class="card-header">
                        <div class="card-header-title">Registro</div>
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
                                        Regístrate
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="card-footer">
                        <div class="card-footer-item">
                            <router-link to="/login"
                            >Ya tengo usuario</router-link
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
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {namespace} from "vuex-class";
const Auth = namespace("Auth");

@Component
export default class RegisterComponent extends Vue {
    private email: string = "";
    private username: string = "";
    private password: string = "";
    private submitted: boolean = false;
    @Auth.Action private register!: (payload: {username: string, email: string, password: string}) => Promise<any>;

    public handleSubmit(e: any) {
        this.submitted = true;
        const { email, username, password } = this;
        if (email && username && password) {
            this.register({
                email: email,
                username: username,
                password: password,
            }).then(
                () => {
                    this.$router.push("/login");
                    this.$buefy.toast.open({
                        message: "Te has registrado con éxito",
                        type: "is-success",
                    });
                },
                (error) => {
                    //ToDo: usar los códigos de error, no comparar mensajes
                    if (error === "Email cannot be null") {
                        this.$buefy.toast.open({
                            duration: 5000,
                            message: "Debes introducir una dirección de email",
                            type: "is-danger",
                        });
                    } else if (error === "Username cannot be null") {
                        this.$buefy.toast.open({
                            duration: 5000,
                            message: "Debes introducir un nombre de usuario",
                            type: "is-danger",
                        });
                    } else if (error === "Password cannot be null") {
                        this.$buefy.toast.open({
                            duration: 5000,
                            message: "Debes introducir una contraseña",
                            type: "is-danger",
                        });
                    } else if (error === "Email in use") {
                        this.$buefy.toast.open({
                            duration: 5000,
                            message: "Ya existe un usuario con ese email",
                            type: "is-danger",
                        });
                    } else if (error === "Username in use") {
                        this.$buefy.toast.open({
                            duration: 5000,
                            message: "Ya existe un usuario con ese nombre",
                            type: "is-danger",
                        });
                    } else if (error === "database error") {
                        this.$buefy.toast.open({
                            duration: 5000,
                            message: "Error inesperado registrando tus datos",
                            type: "is-danger",
                        });
                    }
                }
            );
        }
    }
}
</script>