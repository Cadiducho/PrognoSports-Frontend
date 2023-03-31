<template>
    <div class="landing-footer">
        <footer class="base-footer">
            <div class="footer-top">
                <div class="footer-div">
                <router-link to="/">
                    <img src="@/assets/logo.png" class="image is-128x128" alt="Logo PrognoSports"/>
                </router-link>
                </div>
                <div class="footer-div footer-left">
                    <div class="footer-title">PrognoSports</div>
                    <ul class="footer-ul">
                        <li>
                            <router-link to="/faq" class="list-item">FAQ</router-link>
                        </li>
                        <li>
                            <a href="https://api.prognosports.com/swagger" class="list-item">Documentación</a>
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
                                <o-icon
                                    pack="fas"
                                    icon="envelope"
                                    size="is-small">
                                </o-icon> Contacta con el equipo
                            </router-link>
                        </li>
                        <li>
                            <a href="https://twitter.com/PrognoSports" class="list-item">
                                <o-icon
                                    pack="fab"
                                    icon="twitter"
                                    size="is-small">
                                </o-icon> Twitter
                            </a>
                        </li>
                        <li>
                            <a href="https://telegram.me/PrognoSportsInfo" class="list-item">
                                <o-icon
                                    pack="fab"
                                    icon="telegram"
                                    size="is-small">
                                </o-icon> Telegram
                            </a>
                        </li>
                        <li>
                            <a href="https://twitch.tv/PrognoSports" class="list-item">
                                <o-icon
                                    pack="fab"
                                    icon="twitch"
                                    size="is-small">
                                </o-icon> Twitch
                            </a>
                        </li>
                        <li>
                            <a href="https://instagram.com/PrognoSports" class="list-item">
                                <o-icon
                                    pack="fab"
                                    icon="instagram"
                                    size="is-small">
                                </o-icon> Instagram
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
                        <li>
                            <router-link to="/rules" class="list-item">Normativa</router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <small class="footer-small">© {{ new Date().getFullYear() }} PrognoSports.com. Todos los derechos reservados</small>
            <small class="footer-small">Versión <a :href="`https://github.com/Cadiducho/PrognoSports-Frontend/commit/${commitHash}`">{{ humanVersion }}</a> - Compilado el {{ humanDateTime(commitDate) }}</small>
        </footer>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {useDayjs} from "@/composables/useDayjs";
import {useAuthStore} from "@/store/authStore";

export default defineComponent({
    name: "LandingFooter",
    setup() {
        const branchName = import.meta.env.VITE_GIT_BRANCH_NAME;
        const commitHash = import.meta.env.VITE_GIT_COMMIT_HASH;
        const commitDate = import.meta.env.VITE_GIT_COMMIT_DATE;

        let humanVersion;
        if (branchName === "master") {
            humanVersion = "estable";
        } else {
            humanVersion = branchName
        }
        humanVersion += "/" + commitHash;


        const dayjs = useDayjs();
        const humanDateTime = dayjs.humanDateTime;

        return {commitHash, humanVersion, commitDate, humanDateTime}
    }
});

</script>

<style lang="scss" scoped>
* {
    margin: 0;
    padding: 0;
    text-align: center;
}
a {
    text-decoration: none;
    cursor: pointer;
}
.landing-footer {
    background-color: #f6f9fc;
    display: flex;
    min-height: 50vh;
}
.base-footer {
    margin: 0 auto;
    max-width: 1280px;
    padding: 50px 20px 20px;
    flex: 1;
    // background-color: #f6f9fc;
}
.footer-top {
    display: flex;
    margin-bottom: 1rem;
}
.footer-div {
    flex-grow: 1;
    padding: 1rem;
    flex-basis: 0;
}
.footer-left {
    margin-left: 20%;
}
.footer-ul {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    list-style: none;
}
.footer-title {
    text-align: left;
    font-size: 16px;
    color: #76808d;
    margin-bottom: 12px;
}
.list-item {
    color: #999;
    text-align: left;
    font-size: 14px;
    line-height: 30px
}
.list-item:hover {
    color: #333;
}
.footer-small {
    display: block;
    font-size: 12px;
    color: #b9b9b9;
}
@media screen and (max-width: 798px) {
    .footer-top {
        flex-direction: column;
    }
    .footer-left {
        margin-left: 0;
    }
}
</style>