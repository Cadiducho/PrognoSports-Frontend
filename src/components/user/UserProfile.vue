<template>
    <loading v-if="isLoading" />
    <div v-else>
        <section class="section" v-if="thereIsUserParam && !profile">
            <div class="container">
                <div class="columns is-vcentered">
                    <div class="column has-text-centered">
                        <h1 class="title">Perfil no encontrado</h1>
                        <p class="subtitle">Este perfil no existe o no ha sido encontrado. Vuelve a inicio o inténtalo de nuevo.</p>

                        <b-button @click="$router.go(-1)" class="mr-2" type="is-danger" outlined>Atrás</b-button>
                        <b-button tag="router-link" class="mr-2" type="is-primary" to="/">Inicio</b-button>
                        <b-button tag="router-link" type="is-info" :to="'/u/'+currentUser.id">Mi perfil</b-button>
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

                                        <b-tag v-bind:style="styleRankTag(profile.rank)">{{ profile.rank.name }}</b-tag>
                                    </span>

                                    <b-button v-if="profile.id === currentUser.id"
                                        type="is-primary" icon-left="cog" tag="router-link" to="/settings">
                                        Ajustes
                                    </b-button>
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
                                        Última conexión: {{ profile.last_activity | dateDiff }}
                                    </span>
                                </div>
                                <div class="block mb-1">
                                    <span class="icon-text">
                                        <span class="icon mr-2">
                                            <i class="fas fa-calendar"></i>
                                        </span>
                                        Registrado el {{ profile.created | humanDateTime }}
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
                                        {{ profile.birthdate | humanDate }}
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
import {Component, Vue} from "vue-property-decorator";
import {User, UserResume} from "@/types/User";
import {namespace} from "vuex-class";
import EventBus from "@/plugins/eventbus";
import {userService} from "@/_services";
import {Season} from "@/types/Season";
import {Community} from "@/types/Community";
import UserLevelResume from "@/components/user/UserLevelResume.vue";

const Auth = namespace('Auth')

@Component({
    components: {
        UserLevelResume
    }
})
export default class UserProfile extends Vue {
    @Auth.State("user") private currentUser!: User;
    @Auth.State("community") private currentCommunity!: Community;

    private thereIsUserParam = false;
    private isLoading = true;
    private profile: User | null = null;
    private userResume: UserResume | null = null;

    mounted() {
        const findProfile = new Promise<User | null>((resolve, reject) => {
            // Si se ha buscado un user en la URL, se procesa
            if (this.$route.params.user) {
                this.thereIsUserParam = true;
                userService.getUser(this.$route.params.user).then((user) => {
                    this.profile = user;
                }).catch(()=>{}).finally(() => {
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
    }


    changeBreadcrumb(name: string) {
        EventBus.$emit('breadcrumbLastname', name);
    }

}
</script>

<style lang="css">
</style>