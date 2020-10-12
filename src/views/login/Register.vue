<template>
    <div id="registerComponent">
        <LandingNavbar />
        <!-- ToDo: Rediseño -->
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="pb-3">
                    <h1>Registro</h1>
                </div>
                <div class="card">
                    <div class="card-header">Inserta tus datos</div>

                    <div class="card-body">
                        <form id="register-form" @submit.prevent="handleSubmit">
                            <div class="form-group row">
                                <label for="username" class="col-sm-4 col-form-label text-md-right">Usuario</label>

                                <div class="col-md-6">
                                    <input v-model="username" id="username" type="text" class="form-control" :class="{ 'is-invalid': submitted && !username }" name="username" value required autofocus/>
                                </div>
                            </div>

                            <div class="form-group row">
                                <label for="email" class="col-sm-4 col-form-label text-md-right">Correo electrónico</label>

                                <div class="col-md-6">
                                    <input v-model="email" id="email" type="text" class="form-control" :class="{ 'is-invalid': submitted && !email }" name="email" required autofocus />
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
                                    <button type="submit" class="btn btn-primary">Regístrate</button>
                                </div>
                            </div>
                            <h6>
                                <router-link to="/login">Ya tengo usuario</router-link>
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
    import {UserModule} from "@/_store/modules/UserModule";

    import LandingNavbar from "@/components/landing/LandingNavbar.vue";

    @Component({
        components: {LandingNavbar}
    })
    export default class Register extends Vue {
        private email: string = '';
        private username: string = '';
        private password: string = '';
        private submitted: boolean = false;

        public handleSubmit(e: any) {
            this.submitted = true;
            const { email, username, password } = this;
            if (email && username && password) {
                UserModule.userRegister({email: email, username: username, password: password})
                    .then(() => {
                        this.$router.push('/login');
                        this.$buefy.toast.open({
                            message: 'Te has registrado con éxito',
                            type: 'is-success'
                        });
                    }, (error) => {
                        //ToDo: usar los códigos de error, no comparar mensajes
                        if (error === "Email cannot be null") {
                            this.$buefy.toast.open({
                                duration: 5000,
                                message: 'Debes introducir una dirección de email',
                                type: 'is-danger'
                            });
                        } else if (error === "Username cannot be null") {
                            this.$buefy.toast.open({
                                duration: 5000,
                                message: 'Debes introducir un nombre de usuario',
                                type: 'is-danger'
                            });
                        } else if (error === "Password cannot be null") {
                            this.$buefy.toast.open({
                                duration: 5000,
                                message: 'Debes introducir una contraseña',
                                type: 'is-danger'
                            });
                        } else if (error === "Email in use") {
                            this.$buefy.toast.open({
                                duration: 5000,
                                message: 'Ya existe un usuario con ese email',
                                type: 'is-danger'
                            });
                        } else if (error === "Username in use") {
                            this.$buefy.toast.open({
                                duration: 5000,
                                message: 'Ya existe un usuario con ese nombre',
                                type: 'is-danger'
                            });
                        } else if (error === "database error") {
                            this.$buefy.toast.open({
                                duration: 5000,
                                message: 'Error inesperado registrando tus datos',
                                type: 'is-danger'
                            });
                        }
                    });
            }
        }
    }
</script>