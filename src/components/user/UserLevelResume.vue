<template>
    <nav class="level">
        <div class="level-item has-text-centered">
            <o-tooltip multilined variant="light">
                <template v-slot:content>
                    {{ userResume.standings }}º en el ranking de esta comunidad
                </template>

                <p class="heading">Puesto</p>
                <p class="title">{{ userResume.standings || '0'}}º</p>
            </o-tooltip>
        </div>
        <div class="level-item has-text-centered">
            <div>
                <o-tooltip multilined>
                    <template v-slot:content>
                        <ul>
                            <li v-for="(points, session) in userResume.totalPointsBySession">
                                <b>{{ session }}</b>: {{ points }}
                            </li>
                        </ul>
                    </template>

                    <p class="heading">Puntos</p>
                    <p class="title">
                        {{ userResume.totalPoints || '0' }}
                    </p>
                </o-tooltip>
            </div>
        </div>
        <div class="level-item has-text-centered">
            <div>
                <o-tooltip multilined>
                    <template v-slot:content>
                        <ul>
                            <li v-for="(points, session) in userResume.averagePointsBySession">
                                <b>{{ session }}</b>: {{ points }}
                            </li>
                        </ul>
                    </template>

                    <p class="heading">Media Puntos por sesión</p>
                    <p class="title">
                        {{ userResume.average || '0' }}
                    </p>
                </o-tooltip>
            </div>
        </div>
        <div class="level-item has-text-centered">
            <o-tooltip multilined>
                <template v-slot:content>
                    <ul>
                        <li v-for="(gps, session) in userResume.wonSessions">
                            <b>{{ session }}</b>: {{ gps.join(', ') }}
                        </li>
                    </ul>
                </template>

                <p class="heading">Sesiones ganadas</p>
                <p class="title">
                    {{ countWonSessions(this.userResume.wonSessions) || '0' }}
                </p>
            </o-tooltip>
        </div>
        <div class="level-item has-text-centered">
            <o-tooltip multilined>
                <template v-slot:content>
                    <ul>
                        <li v-for="(name) in userResume.wonGrandPrixes">
                            {{ name }}
                        </li>
                    </ul>
                </template>

                <p class="heading">Grandes Premios ganados</p>
                <p class="title">
                    {{ countWonGPs(this.userResume.wonGrandPrixes) || '0' }}
                </p>
            </o-tooltip>
        </div>
    </nav>

</template>

<script lang="ts">
import {UserResume} from "@/types/User";

import {defineComponent} from "vue";
import {userService} from "@/_services";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";

export default defineComponent({
    name: "UserLevelResume",
    setup() {
        const authStore = useAuthStore();
        const communityStore = useCommunityStore();

        const currentUser = authStore.loggedUser;
        const thereIsCurrentCommunity = communityStore.thereIsCurrentCommunity;
        const currentCommunity = communityStore.currentCommunity;
        return { currentUser, currentCommunity, thereIsCurrentCommunity };
    },
    data() {
        return {
            userResume: {} as UserResume,
        }
    },
    mounted() {
        if (this.thereIsCurrentCommunity) {
            const competition = this.currentCommunity.competition;
            const season = competition.currentSeason;

            userService.getUserResume(this.currentUser, this.currentCommunity, competition, season).then((resume) => {
                this.userResume = resume;
            });
        }
    },
    methods: {
        countWonSessions(wonSessions: Map<string, string[]>) {
            let count = 0;
            if (wonSessions) {
                Object.values(wonSessions).forEach((list, ses) => {
                    count += list.length;
                });
            }

            return count;
        },
        countWonGPs(wonGrandPrixes: string[]) {
            let count = 0;
            if (wonGrandPrixes) {
                count += wonGrandPrixes.length;
            }

            return count;
        }
    }
});
</script>