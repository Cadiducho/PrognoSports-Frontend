<template>
    <loading v-if="isLoading" />
    <div v-else>
        <section class="section" v-if="profile.id === 0">
            <div class="container">
                <div class="columns is-vcentered">
                    <div class="column has-text-centered">
                        <h1 class="title">Perfil no encontrado</h1>
                        <p class="subtitle">Este perfil no existe o no ha sido encontrado. Vuelve a inicio o inténtalo de nuevo.</p>

                        <o-button @click="$router.go(-1)" class="mr-2" variant="danger" outlined>Atrás</o-button>
                        <o-button tag="router-link" class="mr-2" variant="primary" to="/">Inicio</o-button>
                        <o-button tag="router-link" variant="info" :to="'/u/'+currentUser.id">Mi perfil</o-button>
                    </div>
                </div>
            </div>
        </section>
        <div v-else>
            <article class="box">

                <UserProfileCard :profile="profile" :showSettingsButton="true" />

                <hr/>

                <UserLevelResume :user="profile" />

            </article>

            <div class="box">
                <!-- ToDo: Gráficas -->
            </div>
        </div>
    </div>
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

export default defineComponent({
    name: "UserProfile",
    components: {
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
