<template>
  <loading v-if="isLoading" />

  <template v-else>
    <UserNotFound v-if="profile.id === 0" />

    <template v-else>
      <PCard>
        <UserProfileCard
          :profile="profile"
          :show-settings-button="true"
        />

        <hr>

        <UserLevelResume :user="profile" />
      </PCard>

      <PCard class="mt-2">
        <!-- ToDo: Gráficas -->
      </PCard>
    </template>
  </template>
</template>

<script lang="ts">
import {User} from "@/types/User";
import {userService} from "@/_services";
import UserLevelResume from "@/components/user/UserLevelResume.vue";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import useEmitter from "@/composables/useEmitter";
import {useDayjs} from "@/composables/useDayjs";
import UserProfileCard from "@/components/user/UserProfileCard.vue";
import UserNotFound from "@/pages/user/UserNotFound.vue";
import PCard from "@/components/lib/PCard.vue";

export default defineComponent({
    name: "UserProfile",
    components: {
      PCard,
      UserNotFound,
        UserProfileCard,
        UserLevelResume
    },
    setup() {
        const dayjs = useDayjs();
        const emitter = useEmitter();
        const authStore = useAuthStore();
        const communityStore = useCommunityStore();

        const dateDiff = dayjs.dateDiff;
        const humanDateTime = dayjs.humanDateTime;
        const humanDate = dayjs.humanDate;
        const currentUser = authStore.loggedUser;
        const currentCommunity = communityStore.currentCommunity;
        return {currentUser, currentCommunity, emitter, dateDiff, humanDateTime, humanDate};
    },
    data() {
        return {
            thereIsUserParam: false,
            isLoading: true,
            profile: {id: 0} as User,
        }
    },
    mounted() {
        this.isLoading = true;

        // si hay un usuario en la URL, se busca
        if (this.$route.params.user) {
            userService.getUser(this.$route.params.user as string).then((user: User) => {
                this.profile = user;
                this.changeBreadcrumb(this.profile?.username);
                this.isLoading = false;
            }).catch((error: any) => {
                console.log(error);
                this.changeBreadcrumb("Perfil no encontrado");
                this.isLoading = false;
            });
        } else {
            console.log("usando el actual")
            // si no, se utiliza el usuario que ha iniciado sesión
            this.profile = this.currentUser;
            this.changeBreadcrumb("Tu perfil");
            this.isLoading = false;
        }
    },
    methods: {
        changeBreadcrumb(name: string) {
            setTimeout(() => {
                this.emitter.emit('breadcrumbLastname', name);
            }, 50);
        }
    }
});
</script>
