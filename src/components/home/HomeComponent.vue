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
    import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
    import NextGrandPrix from "@/components/gps/NextGrandPrix.vue";
    import PointsAccumulated from "@/components/home/PointsAccumulated.vue";
    import {UserResume} from "@/types/User";
    import {userService} from "@/_services";
    import {Season} from "@/types/Season";
    import {isValidCommunity} from "@/utils";
    import UserLevelResume from "@/components/user/UserLevelResume.vue";

    import {defineComponent} from "vue";
    import {useAuthStore} from "@/pinia/authStore";
    import {useCommunityStore} from "@/pinia/communityStore";

    export default defineComponent({
        name: "Home",
        components: {
            UserLevelResume,
            PointsAccumulated,
            NextGrandPrix,
            PrognoPageTitle,
        },
        setup() {
            const authStore = useAuthStore();
            const communityStore = useCommunityStore();

            const currentUser = authStore.user;
            const isLoggedIn = authStore.isLoggedIn;
            const currentCommunity = communityStore.community;
            return { isLoggedIn, currentUser, currentCommunity };
        },
        data() {
            return {
                userResume: {
                    averageInQualis: 0,
                    averageInRaces: 0,
                    pointsInQualis: 0,
                    pointsInRaces: 0,
                    qualiParticipations: 0,
                    raceParticipations: 0,
                    standing: 0,
                    // FixMe: won sessions
                    wonGrandPrixes: 0, wonQualifySessions: 0, wonRaceSessions: 0,
                    points: 0
                } as UserResume,
            }
        },
        mounted() {
            if (isValidCommunity(this.currentCommunity)) {
                let competition = this.currentCommunity.competition;
                let season: Season = competition.currentSeason;
                userService.getUserResume(this.currentUser, this.currentCommunity, competition, season).then((resume) => {
                    this.userResume = resume;
                });
            }
        }
    });

</script>