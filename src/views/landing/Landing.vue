<template>
<div>
    <vue-headful
        title="PrognoSports"
    />
  <body>
    <!-- Navigation -->
    <nav class="navbar navbar-light bg-light static-top">
      <div class="container">
        <a class="navbar-brand">
          <img src="@/assets/logo.png" class="navbar-brand-image d-inline-block align-top mr-2" alt/>
          PrognoSports
        </a>
        <section>
          <router-link to="/login" class="btn btn-primary" style="margin-right: 0.2em">Iniciar sesión</router-link>
          <router-link to="/register" class="btn btn-outline-primary">Registrarse</router-link>
        </section>
      </div>
    </nav>

    <!-- Masthead -->
    <header class="masthead text-white text-center">
      <div class="overlay"></div>
      <div class="container">
        <div class="row">
          <div class="col-xl-9 mx-auto">
            <h1 class="mb-5">
              Pronostica resultados de
              <span style="white-space: nowrap;">Fórmula 1™</span> con tus amigos y compite por ser el mejor
            </h1>
          </div>
        </div>
      </div>
    </header>

    <!-- Icons Grid -->
    <section class="features-icons bg-light text-center">
      <div class="container">
        <div class="row">
          <div class="col-lg-4">
            <div class="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
              <div class="features-icons-icon d-flex">
                <i class="material-icons m-auto text-primary">people</i>
              </div>
              <h3>Comunitario</h3>
              <p
                class="lead mb-0"
              >Crea una comunidad con tus amigos o únete a una ya existente. Podrás participar en distintas comunidades con diferentes pronósticos y reglas.</p>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="features-icons-item mx-auto mb-0 mb-lg-3">
              <div class="features-icons-icon d-flex">
                <i class="material-icons m-auto text-primary">favorite_border</i>
              </div>
              <h3>Intuitivo</h3>
              <p
                class="lead mb-0"
              >PrognoSports está diseñado para ser intuitivo con las competiciones de motor. Escoge el orden de los pilotos en las distintas sesiones y obtén más puntos que tus rivales.</p>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="features-icons-item mx-auto mb-0 mb-lg-3">
              <div class="features-icons-icon d-flex">
                <i class="material-icons m-auto text-primary">important_devices</i>
              </div>
              <h3>Versátil</h3>
              <p
                class="lead mb-0"
              >Realiza tus pronósticos desde el PC, móvil o tablet sin ninguna limitación.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Image Showcases -->
    <section class="showcase">
      <div class="container-fluid p-0">
        <div class="row no-gutters">
          <div class="col-lg-6 order-lg-2 text-white showcase-img dedicado"></div>
          <div class="col-lg-6 order-lg-1 my-auto showcase-text">
            <h2>Dedicado</h2>
            <p class="lead mb-0">
              Con un diseño dedicado a competiciones de
              <span style="white-space: nowrap;">Fórmula 1™</span>, en una misma página podrás ver todos los datos útiles para tus pronósticos.
            </p>
          </div>
        </div>
        <div class="row no-gutters">
          <div class="col-lg-6 text-white showcase-img visual"></div>
          <div class="col-lg-6 my-auto showcase-text">
            <h2>Visual</h2>
            <p
              class="lead mb-0"
            >Podrás comprobar tus resultados y compararlos con tus rivales mediante sencillas gráficas de puntos, o detalladas tablas de valores.</p>
          </div>
        </div>
        <div class="row no-gutters">
          <div class="col-lg-6 order-lg-2 text-white showcase-img personalizable"></div>
          <div class="col-lg-6 order-lg-1 my-auto showcase-text">
            <h2>A medida</h2>
            <p
              class="lead mb-0"
            >Personaliza cómo quieres visualizar ciertas secciones de la web o qué notificaciones quieres recibir y a dónde. Podrás personalizar PrognoSports a medida.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="call-to-action text-white text-center">
      <div class="overlay"></div>
      <div class="container">
        <div class="row">
          <div class="col-xl-9 mx-auto">
            <h2 class="mb-4">¿Preparado para comenzar?</h2>
            <p class="mb-4">
              <router-link to="/register" class="btn btn-lg btn-info">¡Regístrate!</router-link>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer bg-light">
      <div class="container">
        <div class="row">
          <div class="col-lg-6 h-100 text-center text-lg-left my-auto">
            <ul class="list-inline mb-2">
              <li class="list-inline-item">
                <a href="#">Acerca de</a>
              </li>
              <li class="list-inline-item">&sdot;</li>
              <li class="list-inline-item">
                <a href="#">Contacto</a>
              </li>
              <li class="list-inline-item">&sdot;</li>
              <li class="list-inline-item">
                <a href="#">Términos de uso</a>
              </li>
              <li class="list-inline-item">&sdot;</li>
              <li class="list-inline-item">
                <a href="#">Política de privacidad</a>
              </li>
            </ul>
            <p
              class="text-muted small mb-4 mb-lg-0"
            >&copy; PrognoSports 2019. Todos los derechos reservados.</p>
          </div>
          <div class="col-lg-6 h-100 text-center text-lg-right my-auto">
            <ul class="list-inline mb-0">
              <li class="list-inline-item mr-3">
                <a href="https://twitter.com/PrognoSports">
                  <i class="fab fa-twitter-square fa-2x fa-fw"></i>
                </a>
              </li>
              <li class="list-inline-item">
                <a href="https://t.me/PrognoSportsInfo">
                  <i class="fab fa-telegram fa-2x fa-fw"></i>
                </a>
              </li>
              <li class="list-inline-item">
                <a href="https://instagram.com/PrognoSports">
                  <i class="fab fa-instagram fa-2x fa-fw"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </body>
</div>
</template>

<style lang="scss" scoped>
@import "landing.scss";
</style>