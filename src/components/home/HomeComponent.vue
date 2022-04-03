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
                        <UserLevelResume :user-resume="userResume" />
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
    import {isValidCommunity} from "@/utils";
    import UserLevelResume from "@/components/user/UserLevelResume.vue";

    const Auth = namespace('Auth')

    @Component({
        components: {
            UserLevelResume,
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
            if (isValidCommunity(this.currentCommunity)) {
                let competition = this.currentCommunity.competition;
                let season: Season = competition.currentSeason;
                userService.getUserResume(this.currentUser, this.currentCommunity, competition, season).then((resume) => {
                    this.userResume = resume;
                });
            }
        }
    }
</script>