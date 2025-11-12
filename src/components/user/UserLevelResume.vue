<template>
  <nav
    v-if="userResume.standings !== 0"
    class="flex"
  >
    <div class="grow text-center">
      <PTooltip>
        <p class="text-xs uppercase tracking-tight">
          Puesto
        </p>
        <PTitle tag="p">
          {{ userResume.standings || '0' }}º
        </PTitle>

        <template #tooltip>
          {{ userResume.standings }}º en el ranking de esta comunidad
        </template>
      </PTooltip>
    </div>
    <div class="grow text-center">
      <PTooltip>
        <p class="text-xs uppercase tracking-tight">
          Puntos
        </p>
        <PTitle tag="p">
          {{ userResume.totalPoints || '0' }}
        </PTitle>

        <template #tooltip>
          <ul>
            <li
              v-for="(points, session) in userResume.totalPointsBySession"
              :key="session"
            >
              <b>{{ session }}</b>: {{ points }}
            </li>
          </ul>
        </template>
      </PTooltip>
    </div>
    <div class="grow text-center">
      <PTooltip>
        <p class="text-xs uppercase tracking-tight">
          Media Puntos por sesión
        </p>
        <PTitle tag="p">
          {{ userResume.average || '0' }}
        </PTitle>

        <template #tooltip>
          <ul>
            <li
              v-for="(points, session) in userResume.averagePointsBySession"
              :key="session"
            >
              <b>{{ session }}</b>: {{ points }}
            </li>
          </ul>
        </template>
      </PTooltip>
    </div>
    <div class="grow text-center">
      <PTooltip>
        <p class="text-xs uppercase tracking-tight">
          Sesiones ganadas
        </p>
        <PTitle tag="p">
          {{ countWonSessions }}
        </PTitle>

        <template #tooltip>
          <ul v-if="userResume.wonSessions?.size">
            <li
              v-for="([session, gps], rawKey) in userResume.wonSessions"
              :key="rawKey"
            >
              <b>{{ session }}</b>: {{ gps.join(', ') }}
            </li>
          </ul>
          <ul v-else>
            <li>
              No has ganado Sesiones
            </li>
          </ul>
        </template>
      </PTooltip>
    </div>
    <div class="grow text-center">
      <PTooltip>
        <p class="text-xs uppercase tracking-tight">
          Grandes Premios ganados
        </p>
        <PTitle tag="p">
          {{ countWonGPs }}
        </PTitle>

        <template #tooltip>
          <ul v-if="userResume.wonGrandPrixes?.length">
            <li
              v-for="(name) in userResume.wonGrandPrixes"
              :key="name"
            >
              {{ name }}
            </li>
          </ul>
          <ul v-else>
            <li>
              No has ganado Grandes Premios
            </li>
          </ul>
        </template>
      </PTooltip>
    </div>
  </nav>
</template>

<script setup lang="ts">
import {User, UserResume} from "@/types/User";

import {computed, defineComponent, onMounted, PropType, ref} from "vue";
import {userService} from "@/_services";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import PTitle from "@/components/lib/PTitle.vue";
import PTooltip from "@/components/lib/PTooltip.vue";

const props = defineProps<{
    user: User
}>();

const authStore = useAuthStore();
const communityStore = useCommunityStore();

const currentUser = authStore.loggedUser;
const thereIsCurrentCommunity = communityStore.thereIsCurrentCommunity;
const currentCommunity = communityStore.currentCommunity;

const userResume = ref({
    standings: 0,
    totalPoints: 0,
    average: 0,
    totalPointsBySession: new Map<string, number>(),
    averagePointsBySession: new Map<string, number>(),
    wonSessions: new Map<string, string[]>(),
    wonGrandPrixes: new Array<string>(),
} as UserResume);

onMounted(async () => {
    if (thereIsCurrentCommunity) {
        const competition = currentCommunity.competition;
        const season = competition.currentSeason;
        const user = props.user ?? currentUser;

        try {
            const resumeResponse = await userService.getUserResume(user, currentCommunity, competition, season);
            userResume.value = resumeResponse;
        } catch (error: any) {
          // Mostrar el error por consola si no es un Unauthorized.
          // Esto es porque el usuario puede no tener permisos para ver el ranking de la comunidad
          if (!error.message.includes("Unauthorized")) {
            console.error(error);
          }
        }
    }
})

const countWonSessions = computed(() => {
  let count = 0;
  if (userResume.value.wonSessions) {
    userResume.value.wonSessions.forEach((list, ses) => {
      count += list.length;
    });
  }

  return count;
})

const countWonGPs = computed(() => {
  let count = 0;
  if (userResume.value.wonGrandPrixes) {
    count += userResume.value.wonGrandPrixes.length;
  }

  return count;
})
</script>
