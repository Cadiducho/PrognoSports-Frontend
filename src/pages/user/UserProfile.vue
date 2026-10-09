<template>
  <PPage
    variant="plain"
    :title="pageTitle"
    :loading="isLoading"
    :not-found="profile.id === 0 && 'Perfil no encontrado'"
  >
    <PCard>
      <UserProfileCard
        :profile="profile"
        :show-settings-button="true"
      />

      <hr>

      <UserLevelResume :user="profile" />
    </PCard>

    <PCard>
      <!-- ToDo: Gráficas -->
    </PCard>
  </PPage>
</template>

<script lang="ts">
import {User} from "@/types/User";
import {userService} from "@/_services";
import UserLevelResume from "@/components/user/UserLevelResume.vue";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import {useDayjs} from "@/composables/useDayjs";
import UserProfileCard from "@/components/user/UserProfileCard.vue";
import PCard from "@/components/lib/PCard.vue";

export default defineComponent({
    name: "UserProfile",
    components: {
      PCard,
        UserProfileCard,
        UserLevelResume
    },
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
            thereIsUserParam: false,
            isLoading: true,
            profile: {id: 0} as User,
        }
    },
    computed: {
        pageTitle(): string | undefined {
            if (this.isLoading || this.profile.id === 0) return undefined;
            return this.$route.params.user ? this.profile.username : "Tu perfil";
        }
    },
    mounted() {
        this.isLoading = true;

        // si hay un usuario en la URL, se busca
        if (this.$route.params.user) {
            userService.getUser(this.$route.params.user as string).then((user: User) => {
                this.profile = user;
                this.isLoading = false;
            }).catch((error: any) => {
                console.log(error);
                this.isLoading = false;
            });
        } else {
            console.log("usando el actual")
            // si no, se utiliza el usuario que ha iniciado sesión
            this.profile = this.currentUser;
            this.isLoading = false;
        }
    }
});
</script>
