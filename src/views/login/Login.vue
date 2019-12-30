<template>
    <div id="loginComponent">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="pb-3">
                    <h1>Inicia sesión</h1>
                </div>
                <div class="card">
                    <div class="card-header">Datos de inicio de sesión</div>
                    <div class="card-body">
                        <form @submit.prevent="handleSubmit" aria-label="Login">
                            <div class="form-group row">
                                <label for="username" class="col-sm-4 col-form-label text-md-right">Usuario</label>

                                <div class="col-md-6">
                                    <input v-model="username" id="username" type="text" class="form-control" :class="{ 'is-invalid': submitted && !username }" name="username" value required autofocus/>
                                </div>
                            </div>

                            <div class="form-group row">
                                <label for="password" class="col-md-4 col-form-label text-md-right">Contraseña</label>

                                <div class="col-md-6">
                                    <input v-model="password" id="password" type="password" class="form-control" :class="{ 'is-invalid': submitted && !password }" name="password" required />
                                </div>
                            </div>
                            <div class="form-group row mb-0">
                                <div class="col-md-8 offset-md-4">
                                    <button type="submit" class="btn btn-primary">Acceder</button>
                                </div>
                            </div>
                            <h6>
                                <router-link to="/forgotpassword">He olvidado mi contraseña</router-link>
                            </h6>
                            <h6>
                                <router-link to="/register">Registrarse</router-link>
                            </h6>
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
    import {AUTH_REQUEST} from "@/_store/actions.type";

    export default {
        data () {
            return {
                username: '',
                password: '',
                submitted: false
            }
        },
        computed: {
            ...mapState('account', ['status'])
        },
        created () {
            if (!!this.$store.getters.getRegisteredMail) {
                this.username = this.$store.getters.getRegisteredMail;
            }
        },
        methods: {
            handleSubmit (e) {
                this.submitted = true;
                const { username, password } = this;
                if (username && password) {
                    this.$store.dispatch(AUTH_REQUEST, { username, password })
                    .then(() => {
                        this.$router.push('/home');
                        notifications.fire('Has iniciado sesión correctamente', {
                            autoHide: true,
                            playSound: false,
                            duration: 1500,
                            style: 'info',
                        });
                    }, (error) => {
                        notifications.fire('Fallo al iniciar sesión: ' + error, {
                            autoHide: true,
                            playSound: false,
                            duration: 1500,
                            style: 'danger',
                        });
                    });
                }
            }
        }
    };
</script>