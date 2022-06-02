<template>
    <div>
        <header class="masthead has-text-light has-text-centered has-text-weight-semibold">
            <div class="section">
                <h1 class="heading mb-5">
                    Pronostica resultados de carreras<br/> con tus amigos y compite por ser el mejor
                </h1>
            </div>
        </header>

        <div class="container landing-content">
            <div class="mt-2 tile is-ancestor features-icons mb-0 has-text-centered">
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
            this.$router.push({path: '/register'});
        }
    }
});
</script>