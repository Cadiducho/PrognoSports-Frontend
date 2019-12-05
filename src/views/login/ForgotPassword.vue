<template>
  <div class="row justify-content-center">
    <div class="col-md-8">
      <div class="pb-3">
        <h1>Cambio de contraseña</h1>
      </div>

      <div class="card">
        <div class="card-header">Cambio de contraseña</div>

        <div class="card-body">
          <p
            class="card-text"
          >Para solicitar un cambio de contraseña, deberás introducir el correo electrónico de tu cuenta, donde recibirás un código</p>
          <p
            class="card-text"
          >Con dicho código podrás establecer una nueva contraseña para tu cuenta</p>
          <form id="forgot-form">
            <div class="form-group row">
              <label for="email" class="col-sm-4 col-form-label text-md-right">Correo electrónico</label>
              <div class="col-md-6">
                <input id="email" type="text" class="form-control" name="email" required autofocus />
              </div>
            </div>
            <div class="form-group row" id="token-div" style="display: none;">
              <label
                for="inputToken"
                class="col-sm-4 col-form-label text-md-right"
              >Código de verificación</label>
              <div class="col-md-6">
                <input id="inputToken" type="text" class="form-control" name="inputToken" />
              </div>
            </div>
            <div class="form-group row" id="pw-div" style="display: none;">
              <label
                for="inputPassword"
                class="col-sm-4 col-form-label text-md-right"
              >Nueva contraseña</label>
              <div class="col-md-6">
                <input id="inputPassword" type="password" class="form-control" name="inputPassword" />
              </div>
            </div>

            <div class="form-group row mb-0">
              <div class="col-md-8 offset-md-4">
                <button type="submit" class="btn btn-primary">Solicitar</button>
              </div>
            </div>
            <h6>
              <router-link to="/login">Iniciar sesión</router-link>
            </h6>
            <h6>
              <router-link to="/register">Registrarse</router-link>
            </h6>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    
}

/**
 let changePassword = false;
let formEmail = $('#forgot-form');
formEmail.submit(function (e) {
    e.preventDefault();

    if (!changePassword) {
        let data = {
            "email": $("#email").val()
        };
        $.ajax({
            method: "POST",
            url: "/api/v1/forgotpassword",
            data: JSON.stringify(data),
        }).done(function (response) {
            const notifications = new window.notifications();
            let json = $.parseJSON(response);
            if (json.success) {
                notifications.fire('Tu código de verificación ha sido enviado', {
                    autoHide: true,
                    playSound: false,
                    duration: 2000,
                    style: 'info',
                });

                changePassword = true;
                $("#pw-div").show();
                $("#token-div").show();
            } else {
                if (json.message === "User email cannot be null") {
                    notifications.fire('Debes introducir tu dirección de email', {
                        autoHide: true,
                        playSound: false,
                        duration: 2000,
                        style: 'danger',
                    });
                } else if (json.message === "User not found") {
                    notifications.fire('Usuario no encontrado', {
                        autoHide: true,
                        playSound: false,
                        duration: 2000,
                        style: 'danger',
                    });
                }
            }
        });
    } else {
        let data = {
            "email": $("#email").val(),
            "token": $("#inputToken").val(),
            "password": $("#inputPassword").val()
        };
        $.ajax({
            method: "PATCH",
            url: "/api/v1/forgotpassword",
            data: JSON.stringify(data),
        }).done(function (response) {
            const notifications = new window.notifications();
            let json = $.parseJSON(response);
            if (json.success) {
                notifications.fire('Tu contraseña ha sido restablecida', {
                    autoHide: true,
                    playSound: false,
                    duration: 2000,
                    style: 'info',
                });

                setTimeout(function (e) {
                    window.location.href = "/login";
                }, 2500);
            } else {
                if (json.message === "User email cannot be null") {
                    notifications.fire('Debes introducir tu dirección de email', {
                        autoHide: true,
                        playSound: false,
                        duration: 2000,
                        style: 'danger',
                    });
                } else if (json.message === "User not found") {
                    notifications.fire('Usuario no encontrado', {
                        autoHide: true,
                        playSound: false,
                        duration: 2000,
                        style: 'danger',
                    });
                } else if (json.message === "You must send the security token") {
                    notifications.fire('Debes escribir el código de seguridad recibido', {
                        autoHide: true,
                        playSound: false,
                        duration: 2000,
                        style: 'danger',
                    });
                } else if (json.message === "You must send new the password") {
                    notifications.fire('Debes escribir tu nueva contraseña', {
                        autoHide: true,
                        playSound: false,
                        duration: 2000,
                        style: 'danger',
                    });
                } else if (json.message === "Token rejected") {
                    notifications.fire('Token rechazado. Compruebalo bien o vuelve a intentarlo en 15 minutos', {
                        autoHide: true,
                        playSound: false,
                        duration: 2000,
                        style: 'danger',
                    });
                }
            }
        });
    }
});
 */
</script>