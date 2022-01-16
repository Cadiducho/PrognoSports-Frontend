<template>
    <div id="homeComponent">

        <PrognoPageTitle name="Dashboard" />

        <div class="columns is-variable is-5">
            <div class="column is-4">
                <NextGrandPrix />
            </div>
            <div class="column is-8">
                <div class="tile">
                    <article class="tile is-child box">
                        <p class="title">Resumen</p>
                        <nav class="level is-mobile">
                            <div class="level-item has-text-centered">
                                <b-tooltip multilined type="is-light">
                                    <template v-slot:content>
                                        Eres el {{ userResume.standing }}º en el ranking de esta comunidad
                                    </template>

                                    <p class="heading">Puesto</p>
                                    <p class="title">{{ userResume.standing }}º</p>
                                </b-tooltip>
                            </div>
                            <div class="level-item has-text-centered">
                                <div>
                                    <b-tooltip multilined>
                                        <template v-slot:content>
                                            <ul>
                                                <li>
                                                    <b>Carreras</b>: {{ userResume.pointsInRaces }}
                                                </li>
                                                <li>
                                                    <b>Clasificaciones</b>: {{ userResume.pointsInQualis }}
                                                </li>
                                            </ul>
                                        </template>

                                        <p class="heading">Puntos</p>
                                        <p class="title">
                                            {{ userResume.points }}
                                        </p>
                                    </b-tooltip>
                                </div>
                            </div>
                            <div class="level-item has-text-centered">
                                <b-tooltip multilined type="is-light">
                                    <template v-slot:content>
                                        Esta funcionalidad aún no está implementada
                                    </template>

                                    <p class="heading">Sesiones ganadas</p>
                                    <p class="title">?</p>
                                </b-tooltip>
                            </div>
                            <div class="level-item has-text-centered">
                                <b-tooltip multilined type="is-light">
                                    <template v-slot:content>
                                        Esta funcionalidad aún no está implementada
                                    </template>

                                    <p class="heading">Grandes Premios ganados</p>
                                    <p class="title">?</p>
                                </b-tooltip>
                            </div>
                        </nav>
                        <PointsAccumulated :user="currentUser" />
                    </article>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
    import NextGrandPrix from "@/components/gps/NextGrandPrix.vue";
    import PointsAccumulated from "@/components/home/PointsAccumulated.vue";
    import {User, UserResume} from "@/types/User";
    import {namespace} from 'vuex-class'
    import {seasonService, userService} from "@/_services";
    import {Community} from "@/types/Community";
    import {Season} from "@/types/Season";

    const Auth = namespace('Auth')

    @Component({
        components: {
            PointsAccumulated,
            NextGrandPrix,
            PrognoPageTitle,
        }
    })
    export default class Home extends Vue {

        @Auth.State("user") private currentUser!: User;
        @Auth.State("community") private currentCommunity!: Community;
        @Auth.Getter private isLoggedIn?: boolean;
        private userResume: UserResume = {
            averageInQualis: 0,
            averageInRaces: 0,
            pointsInQualis: 0,
            pointsInRaces: 0,
            qualiParticipations: 0,
            raceParticipations: 0,
            standing: 0,
            wonGrandPrixes: 0, wonQualifySessions: 0, wonRaceSessions: 0,
            points: 0
        };

        get loading() {
            return this.isLoggedIn;
        }

        mounted() {
            if (this.currentCommunity) {
                let competition = this.currentCommunity.competition;
                let season: Season;
                seasonService.getCurrentSeason(competition).then((seasonFetched) => {
                    season = seasonFetched;
                    //ToDo: Poder especificar "current" como Season en el servidor? Evitaría hacer dos peticiones, una para la season y otra la realmente importante
                }).then(() => {
                    userService.getUserResume(this.currentUser, this.currentCommunity, competition, season).then((resume) => {
                        this.userResume = resume;
                    })
                })
            }
        }

        private breadcumbItems = [
            {
                text: 'Inicio',
                to: '/home'
            },
            {
                text: 'Dashboard',
                active: true
            }
        ];
    }
</script>