<template>
    <div id="forgotPasswordComponent">
        <!-- ToDo: Rediseño -->
        <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="pb-3">
                <h1>Cambio de contraseña</h1>
            </div>

            <div class="card">
                <div class="card-header">Cambio de contraseña</div>

                <div class="card-body">
                    <p class="card-text">Para solicitar un cambio de contraseña, deberás introducir el correo electrónico de tu cuenta, donde recibirás un código</p>
                    <p class="card-text">Con dicho código podrás establecer una nueva contraseña para tu cuenta</p>
                    <form @submit.prevent="handleSubmit" id="forgot-form">
                        <div class="form-group row">
                            <label for="email" class="col-sm-4 col-form-label text-md-right">Correo electrónico</label>
                            <div class="col-md-6">
                                <input v-model="email" id="email" type="text" class="form-control" name="email" required autofocus>
                            </div>
                        </div>
                        <div class="form-group row" id="token-div" v-if="showChangePassword">
                            <label for="inputToken" class="col-sm-4 col-form-label text-md-right">Código de verificación</label>
                            <div class="col-md-6">
                                <input v-model="inputToken" id="inputToken" type="text" class="form-control" name="inputToken">
                            </div>
                        </div>
                        <div class="form-group row" id="pw-div" v-if="showChangePassword">
                            <label for="inputPassword" class="col-sm-4 col-form-label text-md-right">Nueva contraseña</label>
                            <div class="col-md-6">
                                <input v-model="inputPassword" id="inputPassword" type="password" class="form-control" name="inputPassword">
                            </div>
                        </div>

                        <div class="form-group row mb-0">
                            <div class="col-md-8 offset-md-4">
                                <button type="submit" class="btn btn-primary">
                                    Solicitar
                                </button>
                            </div>
                        </div>
                        <h6><router-link to="/login">Iniciar sesión</router-link></h6>
                        <h6><router-link to="/register">Registrarse</router-link></h6>
                        <!--<button @click="showChangePassword = !showChangePassword">Debug</button>-->
                    </form>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {UserModule} from "@/_store/modules/UserModule";

    @Component
    export default class ForgotPassword extends Vue {
        private email: string = '';
        private inputToken: string = '';
        private inputPassword: string = '';
        private showChangePassword: boolean = false;

        handleSubmit (e: any) {
            if (!this.showChangePassword) {
                const { email } = this;
                if (email) {
                    UserModule.userForgotPassword(email)
                        .then(() => {
                            this.$buefy.toast.open({
                                message: 'Tu código de verificación ha sido enviado',
                                type: 'is-success'
                            });
                            this.showChangePassword = true;
                        }, (error) => {
                            if (error === "User email cannot be null") {
                                this.$buefy.toast.open({
                                    duration: 5000,
                                    message: 'Debes introducir tu dirección de email',
                                    type: 'is-danger'
                                });
                            } else if (error === "User not found") {
                                this.$buefy.toast.open({
                                    duration: 5000,
                                    message: 'Usuario no encontrado',
                                    type: 'is-danger'
                                });
                            }
                        });
                }
            } else {
                const { email, inputToken, inputPassword } = this;
                if (email) {
                    UserModule.userChangePassword(email, inputToken, inputPassword)
                        .then(() => {
                            this.$buefy.toast.open({
                                message: 'Tu contraseña ha sido restablecida',
                                type: 'is-success'
                            });
                            this.$router.push("/login");
                        }, (error) => {
                            if (error === "User email cannot be null") {
                                this.$buefy.toast.open({
                                    duration: 5000,
                                    message: 'Debes introducir tu dirección de email',
                                    type: 'is-danger'
                                });
                            } else if (error === "User not found") {
                                this.$buefy.toast.open({
                                    duration: 5000,
                                    message: 'Usuario no encontrado',
                                    type: 'is-danger'
                                });
                            } else if (error === "You must send the security token") {
                                this.$buefy.toast.open({
                                    duration: 5000,
                                    message: 'Debes escribir el código de seguridad recibido',
                                    type: 'is-danger'
                                });
                            } else if (error === "You must send new the password") {
                                this.$buefy.toast.open({
                                    duration: 5000,
                                    message: 'Debes escribir tu nueva contraseña',
                                    type: 'is-danger'
                                });
                            } else if (error === "Token rejected") {
                                this.$buefy.toast.open({
                                    duration: 5000,
                                    message: 'Token rechazado. Compruebalo bien o vuelve a intentarlo en 15 minutos',
                                    type: 'is-danger'
                                });
                            }
                        });
                }
            }
        }
    };
</script>