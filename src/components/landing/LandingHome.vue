<template>
    <div>
        <header class="masthead has-text-light has-text-centered has-text-weight-semibold">
            <div class="section">
                <h1 class="heading mb-2">
                    <span>Pronostica resultados de carreras<br/> con tus amigos y compite por ser el mejor</span>
                </h1>
            </div>
        </header>

        <div class="container landing-content">
            <div class="tile is-ancestor features-icons mb-0 has-text-centered">
                <div class="tile is-parent">
                    <article class="tile is-child features-icons-item">
                        <div class="features-icons-icon">
                            <i class="material-icons has-text-link">people</i>
                        </div>
                        <p class="title">
                            Comunitario
                        </p>
                        <p class="subtitle">
                            Crea una comunidad con tus amigos o únete a una ya existente.
                            Podrás participar en distintas comunidades con diferentes pronósticos y reglas.
                        </p>
                    </article>
                </div>
                <div class="tile is-parent">
                    <article class="tile is-child features-icons-item">
                        <div class="features-icons-icon">
                            <i class="material-icons has-text-link">favorite_border</i>
                        </div>
                        <p class="title">
                            Intuitivo
                        </p>
                        <p class="subtitle feature-icons-text">
                            PrognoSports está diseñado para ser intuitivo con las competiciones de motor.
                            Escoge el orden de los pilotos en las distintas sesiones y obtén más puntos que tus rivales.
                        </p>
                    </article>
                </div>
                <div class="tile is-parent">
                    <article class="tile is-child features-icons-item">
                        <div class="features-icons-icon">
                            <i class="material-icons has-text-link">important_devices</i>
                        </div>
                        <p class="title">
                            Versátil
                        </p>
                        <p class="subtitle">
                            Realiza tus pronósticos desde el PC, móvil o tablet sin ninguna limitación.
                        </p>
                    </article>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="section">
                <div class="columns">
                    <div class="column feature-box">
                        <div class="title">
                            Dedicado
                        </div>
                        <div class="text">
                            Con un diseño orientado a competiciones de Fórmula 1™, en una misma página podrás ver todos los datos útiles para tus pronósticos.
                        </div>
                    </div>
                    <div class="column">
                        <img class="image-box border-shadow " src="https://prognosports.com/dist/img/landing/dedicado.png"
                             alt="">
                    </div>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="section">
                <div class="columns reverse-in-mobile">
                    <div class="column">
                        <img class="image-box border-shadow " src="https://prognosports.com/dist/img/landing/visual.png"
                             alt="">
                    </div>
                    <div class="column feature-box">
                        <div class="title">
                            Visual
                        </div>
                        <div class="text">
                            Podrás comprobar tus resultados y compararlos con tus rivales mediante sencillas gráficas de puntos, o detalladas tablas de valores.
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="section">
                <div class="columns">
                    <div class="column feature-box">
                        <div class="title">
                            A medida
                        </div>
                        <div class="text">
                            Personaliza cómo quieres visualizar ciertas secciones de la web o qué notificaciones quieres recibir y a dónde. Podrás personalizar PrognoSports a medida.
                        </div>
                    </div>
                    <div class="column">
                        <img class="image-box border-shadow" src="https://prognosports.com/dist/img/landing/personalizable.png"
                             alt="">
                    </div>
                </div>
            </div>
        </div>
        <div class="primary-background">
            <div class="call-to-action-container">
                <div>
                    <h1 class="call-to-action-h1">¿Preparado para comenzar?</h1>
                    <p class="call-to-action-p">¡Regístrate y prúebalo gratis!</p>
                </div>
                <button class="btn call-to-action-btn" @click="sendToRegister">Registrarse</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: "LandingHome",
    methods: {
        sendToRegister() {
            window.scrollTo({ top: 0, left: 0, behavior: "smooth"});
            this.$router.push({path: '/register'});
        }
    }
});
</script>

<style lang="scss" scoped>
* {
    padding: 0;
    margin: 0;
}
a {
    text-decoration: none;
}

body {
    font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-weight: 700;
}

header.masthead {
    position: relative;
    background: #343a40 url("/spa-portada.jpg") no-repeat center center;
    background-size: cover;
    padding-top: 8rem;
    padding-bottom: 8rem;
}

header.masthead h1 {
    font-size: 2rem;
}

@media (min-width: 768px) {
    header.masthead {
        padding-top: 12rem;
        padding-bottom: 12rem;
    }
    header.masthead h1 {
        font-size: 3rem;
    }
}

.heading {
    font-size: 3rem;
    text-transform: none!important;

    span {
        background-color: rgba(0,0,0,.45);
    }
}

.features-icons {
    padding-top: 4rem;
    padding-bottom: 4rem;
}

.features-icons .features-icons-item {
    max-width: 20rem;
}

.features-icons .features-icons-item .features-icons-icon {
    height: 7rem;
}

.features-icons .features-icons-item .features-icons-icon i {
    font-size: 4.5rem;
}

.features-icons .features-icons-item:hover .features-icons-icon i {
    font-size: 5rem;
}

.features-icons .features-icons-item .features-icons-text {
    font-size: 1.25rem;
    font-weight: 300;
}

.btn {
    width: 280px;
    height: 50px;
    border-radius: 100px;
    border: none;
    font-size: 16px;
    color: #507ce8;
    box-sizing: border-box;
    padding: 0 30px 0 51px;
    background-image: url("@/assets/logo.png");
    background-size: 26px 26px;
    background-repeat: no-repeat;
    background-position: 39px;
    background-color: white;
    outline: none;
    cursor: pointer;
}

.landing-content {
    max-width: 1280px;
    margin: 0 auto;
}

.feature-box {
    margin: 4rem;
    align-self: center;
}

.text {
    font-size: 17px;
    margin-top: 1rem;
    height: 100px;
    color: #6d7d93;
}
.primary-background {
    background-color: #507ce8;
    padding: 38px 20px;
}
.call-to-action-container {
    display: flex;
    justify-content: center;
    align-items: center;
}
.call-to-action-btn {
    margin: 2rem;
}
.call-to-action-h1 {
    font-size: 28px;
    color: white;
}
.call-to-action-p {
    font-size: 17px;
    color: white;
}
</style>