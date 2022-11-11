<template>
    <loading v-if="isLoading" />
    <div v-else>
        <section class="section" v-if="thereIsUserParam && !profile">
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

                <UserLevelResume />

            </article>

            <div class="box">
                <!-- ToDo: Gráficas -->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {User, UserResume} from "@/types/User";
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
            profile: {} as User | null,
            userResume: null as UserResume | null,
        }
    },
    mounted() {
        const findProfile = new Promise<User | null>((resolve, reject) => {
            // Si se ha buscado un user en la URL, se procesa
            if (this.$route.params.user) {
                this.thereIsUserParam = true;
                userService.getUser(this.$route.params.user).then((user) => {
                    this.profile = user;
                }).catch(() => {
                }).finally(() => {
                    this.isLoading = false;

                    resolve(this.profile);
                })
            } else {
                // Si no, se utiliza el usuario que ha iniciado sesión
                this.isLoading = false;
                this.profile = this.currentUser;
                resolve(this.profile);
            }
        });

        findProfile.then((profile) => {
            this.changeBreadcrumb(this.profile?.username || 'Perfil desconocido');
        });
    },
    methods: {
        changeBreadcrumb(name: string) {
            this.emitter.emit('breadcrumbLastname', name);
        }
    }
});
</script>

<style lang="css">
</style>