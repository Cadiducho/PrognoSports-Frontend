<template>

    <h2 class="subtitle">Tokens de inicio de sesión</h2>

    <ul class="block-list no-select is-outlined">
        <li
            v-for="token in authTokens"
            class="has-text-weight-semibold is-flex is-justify-content-space-between" style="background: #f5f5f5;">
            <section class="is-flex is-flex-direction-column">
                <span>
                    <b>Token: </b>{{ token.token }}

                    <span class="tag is-link ml-1 is-italic" v-if="token.current">
                        Usado en la sesión actual
                    </span>
                </span>

                <span><b>Creado: </b>{{ humanDateTime(token.createdAt) }}</span>
                <span><b>Última actividad: </b>{{ humanDateTime(token.lastActivityAt) }} ({{ dateDiff(token.lastActivityAt) }})</span>
            </section>
            <section class="is-flex is-flex-direction-column is-justify-content-space-around">
                <button class="button is-danger" :disabled="token.current" @click="deleteOneAuthToken(token)">Cerrar sesión</button>
            </section>
        </li>
    </ul>

    <button class="button is-danger mb-2" @click="deleteAuthTokens()">Terminar todas las demás sesiones</button>

</template>

<script lang="ts">

import {defineComponent} from "vue";
import {authService, notificationService} from "@/_services";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import {AuthToken} from "@/types/AuthToken";
import {useDayjs} from "@/composables/useDayjs";

export default defineComponent({
    name: "AuthTokenList",
    setup() {
        const dayjs = useDayjs();
        const authStore = useAuthStore();
        const communityStore = useCommunityStore();

        const dateDiff = dayjs.dateDiff;
        const humanDateTime = dayjs.humanDateTime;
        const humanDate = dayjs.humanDate;
        const currentUser = authStore.loggedUser;
        const currentCommunity = communityStore.currentCommunity;


        return {currentUser, currentCommunity, dateDiff, humanDateTime, humanDate};
    },
    data() {
        return {
            authTokens: new Array<AuthToken>(),
        }
    },
    mounted() {
        authService.getAuthTokens().then((tokens) => {
            this.authTokens = [];
            this.authTokens.push(...tokens);
        })
    },
    methods: {

        deleteAuthTokens() {
            authService.deleteAuthTokens().then(() => {
                authService.getAuthTokens().then((tokens) => {
                    this.authTokens = [];
                    this.authTokens.push(...tokens);

                    notificationService.showNotification("Has cerrado todas las demás sesiones abiertas");
                });
            });
        },
        deleteOneAuthToken(token: AuthToken) {
            if (token.current) return;

            authService.deleteOneAuthToken(token).then(() => {
                authService.getAuthTokens().then((tokens) => {
                    this.authTokens = [];
                    this.authTokens.push(...tokens);

                    notificationService.showNotification(`Has cerrado el token ${token.token}`);
                });
            });
        }
    }
});
</script>