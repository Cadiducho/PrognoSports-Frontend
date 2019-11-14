<template>
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
</template>

<script>
  import { mapState } from 'vuex'
  import { USER_REGISTER } from "../../_store/actions/user";
  import { notifications } from "../../js/notifications";

  export default {
    data () {
      return {
        email: '',
        username: '',
        password: '',
        submitted: false
      }
    },
    computed: {
      ...mapState('account', ['status'])
    },
    created () {
    },
    methods: {
      handleSubmit (e) {
        this.submitted = true;
        const { email, username, password } = this;
        if (email && username && password) {
          this.$store.dispatch(USER_REGISTER, { email, username, password })
          .then(() => {
            this.$router.push('/login');
            notifications.fire('Te has registrado con éxito', {
              autoHide: true,
              playSound: false,
              duration: 1500,
              style: 'info',
            });
          }, (error) => {
            if (error === "Email cannot be null") {
              notifications.fire('Debes introducir una dirección de email', {
                autoHide: true,
                playSound: false,
                duration: 2000,
                style: 'danger',
              });
            } else if (error === "Username cannot be null") {
              notifications.fire('Debes introducir un nombre de usuario', {
                autoHide: true,
                playSound: false,
                duration: 2000,
                style: 'danger',
              });
            } else if (error === "Password cannot be null") {
              notifications.fire('Debes introducir una contraseña', {
                autoHide: true,
                playSound: false,
                duration: 2000,
                style: 'danger',
              });
            } else if (error === "Email in use") {
              notifications.fire('Ya existe un usuario con ese email', {
                autoHide: true,
                playSound: false,
                duration: 2000,
                style: 'danger',
              });
            } else if (error === "Username in use") {
              notifications.fire('Ya existe un usuario con ese nombre', {
                autoHide: true,
                playSound: false,
                duration: 2000,
                style: 'danger',
              });
            } else if (error === "database error") {
              notifications.fire('Error inesperado registrando tus datos', {
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
  };
</script>