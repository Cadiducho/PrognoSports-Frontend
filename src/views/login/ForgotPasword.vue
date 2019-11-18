<template>
    <div id="forgotPasswordComponent">
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

<script>
    import { mapState } from 'vuex'
    import { notifications } from "@/js/notifications";
    import {USER_CHANGE_PWD, USER_FORGOT_PWD} from "@/_store/actions/user";

    export default {
        data () {
            return {
                email: '',
                inputToken: '',
                inputPassword: '',
                showChangePassword: false,
            }
        },
        computed: {
            ...mapState('account', ['status'])
        },
        created () {
        },
        methods: {
            handleSubmit (e) {
                if (!this.showChangePassword) {
                    const { email } = this;
                    if (email) {
                        this.$store.dispatch(USER_FORGOT_PWD, { email })
                        .then(() => {
                            notifications.fire('Tu código de verificación ha sido enviado', {
                                autoHide: true,
                                playSound: false,
                                duration: 1500,
                                style: 'info',
                            });
                            this.showChangePassword = true;
                        }, (error) => {
                            if (error === "User email cannot be null") {
                                notifications.fire('Debes introducir tu dirección de email', {
                                    autoHide: true,
                                    playSound: false,
                                    duration: 2000,
                                    style: 'danger',
                                });
                            } else if (error === "User not found") {
                                notifications.fire('Usuario no encontrado', {
                                    autoHide: true,
                                    playSound: false,
                                    duration: 2000,
                                    style: 'danger',
                                });
                            }
                        });
                    }
                } else {
                    const { email, inputToken, inputPassword } = this;
                    if (email) {
                        this.$store.dispatch(USER_CHANGE_PWD, { email, inputToken, inputPassword })
                        .then(() => {
                            notifications.fire('Tu contraseña ha sido restablecida', {
                                autoHide: true,
                                playSound: false,
                                duration: 2000,
                                style: 'success',
                            });
                            this.$router.push("/login");
                        }, (error) => {
                            if (error === "User email cannot be null") {
                                notifications.fire('Debes introducir tu dirección de email', {
                                    autoHide: true,
                                    playSound: false,
                                    duration: 2000,
                                    style: 'danger',
                                });
                            } else if (error === "User not found") {
                                notifications.fire('Usuario no encontrado', {
                                    autoHide: true,
                                    playSound: false,
                                    duration: 2000,
                                    style: 'danger',
                                });
                            } else if (error === "You must send the security token") {
                                notifications.fire('Debes escribir el código de seguridad recibido', {
                                    autoHide: true,
                                    playSound: false,
                                    duration: 2000,
                                    style: 'danger',
                                });
                            } else if (error === "You must send new the password") {
                                notifications.fire('Debes escribir tu nueva contraseña', {
                                    autoHide: true,
                                    playSound: false,
                                    duration: 2000,
                                    style: 'danger',
                                });
                            } else if (error === "Token rejected") {
                                notifications.fire('Token rechazado. Compruebalo bien o vuelve a intentarlo en 15 minutos', {
                                    autoHide: true,
                                    playSound: false,
                                    duration: 2000,
                                    style: 'danger',
                                });
                            }
                        });
                    }
                }
            }
        }
    };
</script>