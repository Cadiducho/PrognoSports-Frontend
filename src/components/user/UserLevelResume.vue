<template>
    <nav class="flex" v-if="userResume.standings !== 0">
        <div class="grow text-center">
            <o-tooltip multilined variant="light">
                <template v-slot:content>
                    {{ userResume.standings }}º en el ranking de esta comunidad
                </template>

                <p class="text-xs uppercase tracking-tight">Puesto</p>
                <PTitle tag="p">
                    {{ userResume.standings || '0'}}º
                </PTitle>
            </o-tooltip>
        </div>
        <div class="grow text-center">
            <o-tooltip multilined>
                <template v-slot:content>
                    <ul>
                        <li v-for="(points, session) in userResume.totalPointsBySession">
                            <b>{{ session }}</b>: {{ points }}
                        </li>
                    </ul>
                </template>

                <p class="text-xs uppercase tracking-tight">Puntos</p>
                <PTitle tag="p">
                    {{ userResume.totalPoints || '0' }}
                </PTitle>
            </o-tooltip>
        </div>
        <div class="grow text-center">
            <o-tooltip multilined>
                <template v-slot:content>
                    <ul>
                        <li v-for="(points, session) in userResume.averagePointsBySession">
                            <b>{{ session }}</b>: {{ points }}
                        </li>
                    </ul>
                </template>

                <p class="text-xs uppercase tracking-tight">Media Puntos por sesión</p>
                <PTitle tag="p">
                    {{ userResume.average || '0' }}
                </PTitle>
            </o-tooltip>
        </div>
        <div class="grow text-center">
            <o-tooltip multilined>
                <template v-slot:content>
                    <ul>
                        <li v-if="userResume.wonSessions?.size" v-for="(gps, session) in userResume.wonSessions">
                            <b>{{ session }}</b>: {{ gps.join(', ') }}
                        </li>
                        <li v-else>No has ganado Sesiones</li>
                    </ul>
                </template>

                <p class="text-xs uppercase tracking-tight">Sesiones ganadas</p>
                <PTitle tag="p">
                    {{ countWonSessions(userResume.wonSessions) || '0' }}
                </PTitle>
            </o-tooltip>
        </div>
        <div class="grow text-center">
            <o-tooltip multilined>
                <template v-slot:content>
                    <ul>
                        <li v-if="userResume.wonGrandPrixes?.length" v-for="(name) in userResume.wonGrandPrixes">
                            {{ name }}
                        </li>
                        <li v-else>No has ganado Grandes Premios</li>
                    </ul>
                </template>

                <p class="text-xs uppercase tracking-tight">Grandes Premios ganados</p>
                <PTitle tag="p">
                    {{ countWonGPs(userResume.wonGrandPrixes) || '0' }}
                </PTitle>
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
import PTitle from "@/components/lib/PTitle.vue";

export default defineComponent({
    name: "UserLevelResume",
    components: {PTitle},
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