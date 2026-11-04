<template>
  <PPage
    :title="thereIsGrandPrix ? `${grandPrix.name} de ${grandPrix.season.name}` : undefined"
    :subtitle="subtitle"
    :loading="isLoadingGrandPrix"
    :not-found="!thereIsGrandPrix && `El Gran Premio ${id} no ha sido encontrado`"
    variant="plain"
  >
    <template #actions>
      <div
        v-if="thereIsGrandPrix"
        class="flex flex-col items-end gap-2"
      >
        <p-button
          v-if="isUserAdmin(currentUser)"
          color="info"
          tag="router-link"
          :to="{ name: 'adminGpEditInSeason', params: {season: season.name, gp: grandPrix.id} } "
        >
          Administración
        </p-button>
        <div class="w-60">
          <GrandPrixPagination
            :is-admin-pag="false"
            :competition="grandPrix.competition"
            :grand-prix="grandPrix"
          />
        </div>
      </div>
    </template>

    <PrognoAlert
      v-if="!grandPrix.sessions || !grandPrix.sessions.length"
      variant="warning"
    >
      No hay sesiones configuradas en este Gran Premio
    </PrognoAlert>

    <CircuitCard
      v-if="grandPrix.circuit && grandPrix.variant"
      :circuit="grandPrix.circuit!"
      :variant="grandPrix.variant!"
      :laps="grandPrix.laps"
    />

    <SessionSelector
      v-model="activeTab"
      :sessions="grandPrix.sessions"
    />

    <PCard>
      <PTabPanel
        v-for="session in grandPrix.sessions"
        :key="`tipps-${session.name}`"
        :name="session.name"
        :active-tab="activeTab"
        instant
      >
        <ClouseDateMessage :session="session" />
        <h6 class="dark:text-gray-300">
          Para esta sesión se han de pronosticar {{ ruleSetPredictedPositions(ruleSet, session) }} pilotos
        </h6>
        <SelectTipps
          :session="session"
          :grand-prix="grandPrix"
          :rule-set="ruleSet"
          :drivers="drivers"
          :start-grids="startGrid"
        >
          <template
            v-if="startGrid.get(session)"
            #grid
          >
            <StartGrid
              :session="session"
              :grid="startGrid.get(session)!"
              :grand-prix="grandPrix"
            />
          </template>
        </SelectTipps>
      </PTabPanel>
    </PCard>

    <SessionSelector
      v-model="activeTab"
      :sessions="grandPrix.sessions"
    />

    <PCard>
      <PTabPanel
        v-for="session in grandPrix.sessions"
        :key="`score-${session.name}`"
        :name="session.name"
        :active-tab="activeTab"
        instant
      >
        <ClouseDateMessage :session="session" />
        <ScoreComponents
          :gp="grandPrix"
          :rule-set="ruleSet"
          :session="session"
          :drivers="drivers"
          :community-members="communityMembers"
          :user-points="userPoints"
        />
      </PTabPanel>
    </PCard>
  </PPage>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import dayjs from "dayjs";
import CircuitCard from "@/components/gps/CircuitCard.vue";
import StartGrid from "@/components/gps/StartGridList.vue";
import SelectTipps from "@/components/gps/SelectTipps.vue";
import ScoreComponents from "@/components/gps/ScoreComponent.vue";
import GrandPrixPagination from "@/components/gps/GrandPrixPagination.vue";
import ClouseDateMessage from "@/components/gps/ClouseDateMessage.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import PCard from "@/components/lib/PCard.vue";
import PTabPanel from "@/components/lib/PTabPanel.vue";
import SessionSelector from "@/components/gps/SessionSelector.vue";
import {useDayjs} from "@/composables/useDayjs";
import {
  communityService,
  driversService,
  grandPrixService,
  notificationService,
  rulesetService,
  scoreService
} from "@/_services";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import {Season} from "@/types/Season";
import {GrandPrix} from "@/types/GrandPrix";
import {StartGridPosition} from "@/types/StartGridPosition";
import {UserPoints} from "@/types/UserPoints";
import {Dictionary} from "@/types/Dictionary";
import {RaceSession} from "@/types/RaceSession";
import {RuleSet} from "@/types/RuleSet";
import {Driver} from "@/types/Driver";
import {CommunityUser} from "@/types/CommunityUser";
import {isUserAdmin} from "@/utils/user";
import {ruleSetPredictedPositions} from "@/utils/ruleSet";
import {grandPrixFirstDate, grandPrixLastDate} from "@/utils/grandPrix";

defineOptions({name: "OneGrandPrix"});

const route = useRoute();
const currentUser = useAuthStore().loggedUser;
const currentCommunity = useCommunityStore().currentCommunity;

const season = {name: route.params.season} as Season;
const id = route.params.gp as string;

const grandPrix = ref<GrandPrix>({} as GrandPrix);
const ruleSet = ref<RuleSet>({} as RuleSet);
const drivers = ref<Array<Driver>>([]);
const communityMembers = ref<Array<CommunityUser>>([]);

const isLoadingGrandPrix = ref(true);
const thereIsGrandPrix = ref(false);
const startGrid = ref(new Map<RaceSession, Array<StartGridPosition>>());
const userPoints = ref<Dictionary<number, UserPoints>>({});
const activeTab = ref("");

const {humanDayMonth} = useDayjs();

const subtitle = computed(() => {
  if (!thereIsGrandPrix.value) {
    return undefined;
  }
  const gp = grandPrix.value;
  const round = `Ronda ${gp.round}`;
  if (!gp.sessions?.length) {
    return round;
  }
  return `${round} · ${grandPrixFirstDate(gp).getDate()} - ${humanDayMonth(grandPrixLastDate(gp))}`;
});

/**
 * Parrilla de cada sesión del Gran Premio, junto a su sesión: las sesiones se reordenan por fecha mientras
 * se piden, así que emparejarlas por índice podía asignar una parrilla a otra sesión
 */
async function getStartGrids(gp: GrandPrix): Promise<Array<{ session: RaceSession, grid: StartGridPosition[] }>> {
  return Promise.all(gp.sessions.map(async (session) => ({
    session,
    grid: await grandPrixService.getGrandPrixGrid(gp, session),
  })));
}

onMounted(async () => {
  try {
    const gp = await grandPrixService.getGrandPrixInSeason(season, id);
    grandPrix.value = gp;

    const loading = Promise.all([
      driversService.getDriversInGrandPrix(gp),
      rulesetService.getRuleSetInGrandPrix(currentCommunity, gp),
      scoreService.getPointsInGrandPrix(currentCommunity, gp),
      communityService.getMembers(currentCommunity),
      getStartGrids(gp)
    ]).then(([driversInGp, gpRuleSet, points, members, rawStartGrids]) => {
      drivers.value = driversInGp;
      ruleSet.value = gpRuleSet;
      communityMembers.value = members;
      thereIsGrandPrix.value = true;

      points.forEach((userPoint) => {
        userPoints.value[userPoint.user.id] = userPoint;
      });

      // Cada parrilla viene emparejada con su sesión; se añaden por fecha
      [...rawStartGrids]
        .sort((a, b) => a.session.date.getTime() - b.session.date.getTime())
        .forEach(({session, grid}) => {
          if (grid.length > 0) {
            startGrid.value.set(session, grid);
          }
        });

      isLoadingGrandPrix.value = false;
    });

    // Ordeno las sesiones por fecha
    gp.sessions.sort((a: RaceSession, b: RaceSession) => a.date.getTime() - b.date.getTime());
    // Colocar la tab correcta según cuál es la siguiente sesión que va a tener lugar
    for (const ses of gp.sessions) {
      activeTab.value = ses.name;
      if (dayjs().isBefore(dayjs(ses.date).add(2, 'h'))) {
        break;
      }
    }
    // Si se llega con `?sesion=<nombre>` (por ejemplo desde el Inicio), esa sesión tiene prioridad
    const requested = route.query.sesion;
    if (typeof requested === 'string' && gp.sessions.some((ses: RaceSession) => ses.name === requested)) {
      activeTab.value = requested;
    }

    await loading;
  } catch (error: any) {
    thereIsGrandPrix.value = false;
    isLoadingGrandPrix.value = false;
    notificationService.showNotification(error.message, 'error');
  }
});
</script>
