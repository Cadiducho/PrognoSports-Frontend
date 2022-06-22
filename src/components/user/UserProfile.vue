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
                <div class="section">
                    <div class="container">
                        <div class="columns is-mobile">
                            <div class="column is-1"></div>
                            <div class="column">
                                <figure class="image is-1by1">
                                    <img :src="userProfileImage(profile)" alt="Profile image"/>
                                </figure>
                            </div>
                            <div class="column is-1"></div>
                            <div class="column is-two-thirds content">
                                <p class="is-flex is-mobile is-justify-content-space-between">
                                    <span class="title is-bold">
                                        {{ profile.username }}

                                        <span class="tag" :style="styleRankTag(profile.rank)">{{ profile.rank.name }}</span>
                                    </span>

                                    <o-button v-if="profile.id === currentUser.id"
                                        variant="primary" icon-left="cog" tag="router-link" to="/settings">
                                        Ajustes
                                    </o-button>
                                </p>
                                <p v-if="profile.bio">
                                    <span class="subtitle">
                                        <small>{{ profile.bio }}</small>
                                    </span>
                                </p>

                                <div class="block mb-1">
                                    <span class="icon-text">
                                        <span class="icon mr-2">
                                            <i class="fas fa-clock"></i>
                                        </span>
                                        Última conexión: {{ dateDiff(profile.last_activity) }}
                                    </span>
                                </div>
                                <div class="block mb-1">
                                    <span class="icon-text">
                                        <span class="icon mr-2">
                                            <i class="fas fa-calendar"></i>
                                        </span>
                                        Registrado el {{ humanDateTime(profile.created) }}
                                    </span>
                                </div>
                                <div v-if="profile.location" class="block mb-1">
                                    <span class="icon-text">
                                        <span class="icon mr-2">
                                            <i class="fas fa-map-marker-alt"></i>
                                        </span>
                                        {{ profile.location }}
                                    </span>
                                </div>
                                <div v-if="profile.birthdate" class="block mb-1">
                                    <span class="icon-text">
                                        <span class="icon mr-2">
                                            <i class="fas fa-birthday-cake"></i>
                                        </span>
                                        {{ humanDate(profile.birthdate) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <hr/>

                <UserLevelResume v-if="userResume" :user-resume="userResume" />

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
import {Season} from "@/types/Season";
import UserLevelResume from "@/components/user/UserLevelResume.vue";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import useEmitter from "@/composables/useEmitter";
import {useDayjs} from "@/composables/useDayjs";

export default defineComponent({
    name: "UserProfile",
    components: {
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
        const currentUser = authStore.user;
        const currentCommunity = communityStore.community;
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

            let competition = this.currentCommunity.competition;
            let season: Season = competition.currentSeason;
            userService.getUserResume(this.currentUser, this.currentCommunity, competition, season).then((resume) => {
                console.log(resume);
                this.userResume = resume;
            });
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