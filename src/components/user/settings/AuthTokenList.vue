<template>
  <PTitle
    type="subtitle"
    tag="h2"
    class="dark:text-white"
  >
    Tokens de inicio de sesión recientes
  </PTitle>

  <ul class="select-none outline-solid pl-0 space-y-3">
    <li
      v-for="token in authTokens.slice(0, 5)"
      :key="token.token"
      class="font-semibold flex justify-between p-2 bg-slate-50 dark:bg-slate-800 dark:text-white"
    >
      <section class="flex flex-col">
        <span>
          <b>Token: </b>{{ token.token }}

          <PTag
            v-if="token.current"
            color="primary"
            size="small"
            class="italic"
          >
            Usado en la sesión actual
          </PTag>
        </span>

        <span><b>Creado: </b>{{ humanDateTime(token.createdAt) }} ({{ dateDiff(token.createdAt) }})</span>
        <span><b>Última actividad: </b>{{ humanDateTime(token.lastActivityAt) }} ({{ dateDiff(token.lastActivityAt) }})</span>
      </section>
      <section class="flex flex-col justify-around">
        <PButton
          size="small"
          type="soft"
          color="danger"
          :disabled="token.current"
          @click="deleteOneAuthToken(token)"
        >
          Cerrar sesión
        </PButton>
      </section>
    </li>
  </ul>

  <PButton
    class="mt-2"
    type="solid"
    color="danger"
    @click="deleteAuthTokens()"
  >
    Cerrar todas las demás sesiones
  </PButton>
</template>


<script lang="ts">

import {defineComponent} from "vue";
import {authService, notificationService} from "@/_services";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import {AuthToken} from "@/types/AuthToken";
import {useDayjs} from "@/composables/useDayjs";
import PTitle from "@/components/lib/PTitle.vue";
import PTag from "@/components/lib/PTag.vue";
import PButton from "@/components/lib/forms/PButton.vue";

export default defineComponent({
    name: "AuthTokenList",
  components: {PButton, PTag, PTitle},
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
