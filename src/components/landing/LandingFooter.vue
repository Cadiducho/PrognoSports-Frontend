<template>
    <div class="landing-footer">
        <footer class="base-footer">
            <div class="footer-top">
                <div class="footer-div">
                <router-link to="/">
                    <img src="@/assets/logo.png" alt="Logo PrognoSports"/>
                </router-link>
                </div>
                <div class="footer-div footer-left">
                    <div class="footer-title">PrognoSports</div>
                    <ul class="footer-ul">
                        <li>
                            <router-link to="/faq" class="list-item">FAQ</router-link>
                        </li>
                        <li>
                            <a href="https://api.prognosports.com/docs" class="list-item">Documentación</a>
                        </li>
                        <li>
                            <a href="https://github.com/Cadiducho/PrognoSports-Frontend" class="list-item">Github</a>
                        </li>
                    </ul>
                </div>
                <div class="footer-div">
                    <div class="footer-title">Conecta</div>
                    <ul class="footer-ul">
                        <li>
                            <router-link to="/contact" class="list-item">
                                <b-icon
                                    pack="fas"
                                    icon="envelope"
                                    size="is-small">
                                </b-icon> Contacta con el equipo
                            </router-link>
                        </li>
                        <li>
                            <a href="https://twitter.com/PrognoSports" class="list-item">
                                <b-icon
                                    pack="fab"
                                    icon="twitter"
                                    size="is-small">
                                </b-icon> Twitter
                            </a>
                        </li>
                        <li>
                            <a href="https://telegram.me/PrognoSportsInfo" class="list-item">
                                <b-icon
                                    pack="fab"
                                    icon="telegram"
                                    size="is-small">
                                </b-icon> Telegram
                            </a>
                        </li>
                        <li>
                            <a href="https://instagram.com/PrognoSports" class="list-item">
                                <b-icon
                                    pack="fab"
                                    icon="instagram"
                                    size="is-small">
                                </b-icon> Instagram
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="footer-div">
                    <div class="footer-title">Legal</div>
                    <ul class="footer-ul">
                        <li>
                            <router-link to="/terms" class="list-item">Términos de servicio</router-link>
                        </li>
                        <li>
                            <router-link to="/privacy" class="list-item">Política de privacidad</router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <small class="footer-small">© {{ new Date().getFullYear() }} PrognoSports.com. Todos los derechos reservados</small>
        </footer>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component
export default class LandingFooter extends Vue {

}
</script>

<style lang="scss" scoped>
@import "footer";
</style>