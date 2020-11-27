<template>
  <div id="loginComponent">
    <LandingNavbar />
    <div class="container">
      <div class="card">
        <div class="card-header">
          <div class="card-header-title">Datos de inicio de sesión</div>
        </div>
        <div class="card-content">
          <form>
            <div class="field">
              <label class="label">Usuario</label>
              <div class="control has-icons-left has-icons-right">
                <input
                  v-model="username"
                  id="username"
                  autofocus
                  required
                  class="input"
                  :class="{ 'is-danger': submitted && !username }"
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
              <div class="control has-icons-left has-icons-right">
                <input
                  v-model="password"
                  id="password"
                  required
                  class="input"
                  :class="{ 'is-danger': submitted && !password }"
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
                <button v-on:click.prevent="handleSubmit()" class="button is-link">Acceder</button>
              </div>
            </div>
          </form>
        </div>
        <div class="card-footer">
          <div class="card-footer-item">
            <router-link to="/register">Registrarse</router-link>
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
</template>

<!-- <form @submit.prevent="handleSubmit" aria-label="Login">
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
                        </form> -->

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { AuthModule } from "@/_store/modules/AuthModule";
import { UserModule } from "@/_store/modules/UserModule";
import LandingNavbar from "@/components/landing/LandingNavbar.vue";
import { Action } from 'vuex-module-decorators';

@Component({
  components: { LandingNavbar },
})
export default class Login extends Vue {
  username: string = "";
  password: string = "";
  submitted: boolean = false;

  created() {
    if (!!UserModule.registeredMail) {
      this.username = UserModule.registeredMail;
    }
  }

  @Action
  public handleSubmit() {
    this.submitted = true;
    if (this.username && this.password) {
      AuthModule.authRequest({
        username: this.username,
        password: this.password,
      }).then(
        () => {
          this.$buefy.toast.open({
            message: "¡Has iniciado sesión correctamente!",
            type: "is-success",
          });

          // this.$router.push({ name: "home" });

        },
        (error: any) => {
          this.$buefy.toast.open({
            duration: 5000,
            message: "Fallo al iniciar sesión: " + error,
            type: "is-danger",
          });
        }
      );
    }
  }
}
</script>
