<template>
    <nav class="level" v-if="userResume.standings !== 0">
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
                        <li v-if="userResume.wonSessions?.size" v-for="(gps, session) in userResume.wonSessions">
                            <b>{{ session }}</b>: {{ gps.join(', ') }}
                        </li>
                        <li v-else>No has ganado Sesiones</li>
                    </ul>
                </template>

                <p class="heading">Sesiones ganadas</p>
                <p class="title">
                    {{ countWonSessions(userResume.wonSessions) || '0' }}
                </p>
            </o-tooltip>
        </div>
        <div class="level-item has-text-centered">
            <o-tooltip multilined>
                <template v-slot:content>
                    <ul>
                        <li v-if="userResume.wonGrandPrixes?.length" v-for="(name) in userResume.wonGrandPrixes">
                            {{ name }}
                        </li>
                        <li v-else>No has ganado Grandes Premios</li>
                    </ul>
                </template>

                <p class="heading">Grandes Premios ganados</p>
                <p class="title">
                    {{ countWonGPs(userResume.wonGrandPrixes) || '0' }}
                </p>
            </o-tooltip>
        </div>
    </nav>

</template>

<script lang="ts">
import {User, UserResume} from "@/types/User";

import {defineComponent, PropType} from "vue";
import {userService} from "@/_services";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";

export default defineComponent({
    name: "UserLevelResume",
    props: {
        user: {
            type: Object as PropType<User>,
            required: true
        },
    },
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
            userResume: {standings: 0} as UserResume,
        }
    },
    mounted() {
        if (this.thereIsCurrentCommunity) {
            const competition = this.currentCommunity.competition;
            const season = competition.currentSeason;
            const user = this.user ?? this.currentUser;

            userService.getUserResume(user, this.currentCommunity, competition, season).then((response) => {
                this.userResume = response;
            }).catch((error) => {
                // Mostrar el error por consola si no es un Unauthorized.
                // Esto es porque el usuario puede no tener permisos para ver el ranking de la comunidad
                if (!error.message.includes("Unauthorized")) {
                    console.error(error);
                }
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