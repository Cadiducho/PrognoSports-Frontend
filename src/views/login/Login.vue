<template>
    <div id="loginComponent">
        <LandingNavbar />
        <!-- ToDo: Rediseño -->
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

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import { AuthModule } from "@/_store/modules/AuthModule";
    import {UserModule} from "@/_store/modules/UserModule";
    import LandingNavbar from "@/components/landing/LandingNavbar.vue";

    @Component({
        components: {LandingNavbar}
    })
    export default class Login extends Vue {

        username: string = '';
        password: string = '';
        submitted: boolean = false;

        created () {
            if (!!UserModule.registeredMail) {
                this.username = UserModule.registeredMail;
            }
        }

        public handleSubmit (e: any) {
            this.submitted = true;
            if (this.username && this.password) {
                AuthModule.authRequest({username: this.username, password: this.password}).
                    then(() => {
                        this.$router.push({name: 'home'});

                        this.$buefy.toast.open({
                            message: '¡Has iniciado sesión correctamente!',
                            type: 'is-success'
                        });
                    }, (error: any) => {
                        this.$buefy.toast.open({
                            duration: 5000,
                            message: 'Fallo al iniciar sesión: ' + error,
                            type: 'is-danger'
                        });
                    });
            }
        }
    };
</script>