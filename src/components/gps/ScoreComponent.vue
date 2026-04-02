<template>
  <div>
    <Loading v-if="!loaded" />
    <template v-else>
      <h5 class="text-lg font-semibold dark:text-gray-300">
        Puntuaciones de {{ session.humanName() }}
      </h5>
      <h6 class="text-base font-medium dark:text-gray-300 mt-1">
        Leyenda
      </h6>
      <p class="mb-4 dark:text-gray-300">
        Tus puntuaciones salen reflejadas con color
        <PTag color="success" size="small">verde</PTag><br>
        El ganador del Gran Premio es reflejado con color
        <PTag color="warning" size="small">dorado</PTag><br>
        Los ganadores de cada sesión tendrán representado un <i class="fas fa-trophy" />
        <span v-if="ruleSet.data.pointsByTopScorer > 0">
          <br>
          El usuario que haya logrado el mayor número de aciertos en todo el Gran Premio tendrá un bonus de {{ ruleSet.data.pointsByTopScorer || 0 }} puntos.
        </span>
      </p>

      <PrognoAlert
        v-if="currentUser.preferences['hide-tipps-until-start'] === true"
        variant="info"
        :icon="false"
        aria-close-label="Close notification"
      >
        Tus pronósticos están ocultos al resto de usuarios hasta {{ humanDateTime(session.closureDate()) }} ({{ dateDiff(session.closureDate()) }})
      </PrognoAlert>
      <PrognoAlert
        v-if="!thereAreFinishResults"
        variant="success"
        :icon="false"
        aria-close-label="Close notification"
      >
        Aún no hay resultados confirmados para esta sesión
      </PrognoAlert>

      <PrognoAlert
        v-if="isSimulated"
        variant="warning"
        :icon="false"
        aria-close-label="Close notification"
      >
        <i class="fas fa-chart-bar" /> Visualización de escenarios — estos resultados no son reales
      </PrognoAlert>

      <PTable
        :columns="columns"
        :rows="tableData"
        :row-class="getRowClass"
        row-key="user.id"
        default-sort-field="score.accumulated"
        default-sort-direction="DESC"
      />

      <hr class="my-4 border-gray-300 dark:border-gray-700">
      <h6 class="text-base font-medium dark:text-gray-300">
        Opciones de la tabla
      </h6>
      <section class="flex flex-col gap-2 mt-2">
        <PCheckbox
          id="showAdvancedStadistics"
          v-model="showAdvancedStadistics"
          color="secondary"
        >
          Mostrar estadísticas avanzadas
        </PCheckbox>
        <PCheckbox
          id="showResults"
          v-model="showResults"
          color="secondary"
        >
          Mostrar resultados
        </PCheckbox>
        <PCheckbox
          id="showUserColor"
          v-model="showUserColor"
          color="secondary"
        >
          Mostrar color en tu usuario
        </PCheckbox>
        <PCheckbox
          id="showWinnerColor"
          v-model="showWinnerColor"
          color="secondary"
        >
          Mostrar color en el ganador
        </PCheckbox>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import {computed, markRaw, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {storeToRefs} from "pinia";
import {grandPrixService, scoreService} from "@/_services";
import {useAuthStore} from "@/store/authStore";
import {useAppStore} from "@/store/appStore";
import {useCommunityStore} from "@/store/communityStore";
import {useDayjs} from "@/composables/useDayjs";
import {useStyles} from "@/composables/useStyles";
import useEmitter from "@/composables/useEmitter";
import type {GrandPrix} from "@/types/GrandPrix";
import type {RuleSet} from "@/types/RuleSet";
import type {RaceSession, SessionId} from "@/types/RaceSession";
import type {CommunityUser} from "@/types/CommunityUser";
import type {RaceResult} from "@/types/RaceResult";
import type {UserPoints} from "@/types/UserPoints";
import type {Driver} from "@/types/Driver";
import type {User, UserId} from "@/types/User";
import type {Dictionary} from "@/types/Dictionary";
import type {Column} from "@/components/lib/table";
import type {ScoreCalculations} from "@/types/ScoreCalculations";
import Loading from "@/components/lib/Loading.vue";
import PCheckbox from "@/components/lib/forms/PCheckbox.vue";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import PTag from "@/components/lib/PTag.vue";
import PTable from "@/components/lib/table/PTable.vue";
import StandingsFormatter from "@/components/gps/score/formatters/StandingsFormatter.vue";
import UsernameFormatter from "@/components/gps/score/formatters/UsernameFormatter.vue";
import SessionResultFormatter from "@/components/gps/score/formatters/SessionResultFormatter.vue";
import SessionPointsFormatter from "@/components/gps/score/formatters/SessionPointsFormatter.vue";
import TotalHitsFormatter from "@/components/gps/score/formatters/TotalHitsFormatter.vue";
import GpPointsFormatter from "@/components/gps/score/formatters/GpPointsFormatter.vue";
import PercentageFormatter from "@/components/gps/score/formatters/PercentageFormatter.vue";
import BoldValueFormatter from "@/components/gps/score/formatters/BoldValueFormatter.vue";

interface TableRow {
  user: User;
  tipps: Array<RaceResult | undefined>;
  score: {
    bySession: Dictionary<SessionId, number>;
    hitPercentageBySession: Dictionary<SessionId, number>;
    totalHits: number;
    gp: number;
    hitPercentageInGP: number;
    accumulated: number;
    standings: number;
    previousStandings: number;
  };
}

const props = defineProps<{
  gp: GrandPrix;
  ruleSet: RuleSet;
  session: RaceSession;
  communityMembers: CommunityUser[];
  userPoints: Dictionary<number, UserPoints>;
  isSimulated?: boolean;
}>();

const authStore = useAuthStore();
const communityStore = useCommunityStore();
const appStore = useAppStore();
const dayjs = useDayjs();
const styles = useStyles();
const emitter = useEmitter();

const currentUser = authStore.loggedUser;
const currentCommunity = communityStore.currentCommunity;
const dateDiff = dayjs.dateDiff;
const humanDateTime = dayjs.humanDateTime;
const styleCodeInResults = styles.styleCodeInResults;
const {showAdvancedStadistics, showResults, showUserColor, showWinnerColor} = storeToRefs(appStore);

const isSimulated = computed(() => props.isSimulated ?? false);
const loaded = ref(false);
const thereAreFinishResults = ref(false);
const sessionResults = ref<RaceResult[]>([]);
const pointsByPosition = ref<Dictionary<SessionId, Dictionary<UserId, number>>>({});
const totalHits = ref<Dictionary<UserId, number>>({});
const hitsBySession = ref<Dictionary<UserId, Dictionary<SessionId, number>>>({});
const tableData = ref<TableRow[]>([]);
const winnersBySession = ref<Record<number, string[]>>({});
const winnersOfGrandPrix = ref<string[]>([]);

const topScorerUsers = computed<UserId[]>(() => {
  let topScorers: UserId[] = [];
  let maxHits = -1;

  for (const userId in totalHits.value) {
    const hits = totalHits.value[userId] || 0;
    if (hits > maxHits) {
      maxHits = hits;
      topScorers = [Number(userId)];
    } else if (hits === maxHits && maxHits > -1) {
      topScorers.push(Number(userId));
    }
  }

  return topScorers;
});

const sessionHumanName = (id: number): string => {
  return RaceSession.findById(id)?.humanName() ?? "Desconocida";
};

const driverTooltip = (driver: Driver): string => {
  if (driver.code === "???") return "Pronóstico oculto";
  return `${driver.firstname} ${driver.lastname} (${driver.team.name})`;
};

const findWinnerUserOfSession = (session?: RaceSession): string[] => {
  let maxPoints = -Infinity;
  let winners: string[] = [];

  for (const key in props.userPoints) {
    const value = props.userPoints[key]!;
    const points = session ? (value.pointsBySession[session.id] ?? 0) : (value.pointsInGP ?? 0);

    if (points > maxPoints) {
      maxPoints = points;
      winners = points !== 0 ? [value.user.username] : [];
    } else if (points === maxPoints && points !== 0) {
      winners.push(value.user.username);
    }
  }

  return winners;
};

const getRowClass = (row: TableRow): string => {
  if (winnersOfGrandPrix.value.includes(row.user.username) && showWinnerColor.value) {
    return "bg-amber-200 dark:bg-amber-700/50";
  }
  if (row.user.username === currentUser.username && showUserColor.value) {
    return "bg-green-200 dark:bg-green-700/50";
  }
  return "";
};

const buildColumns = (): Column[] => {
  const cols: Column[] = [
    {
      label: "Pos.",
      field: "score.standings",
      sortable: true,
      sortKey: "score.standings",
      formatter: markRaw(StandingsFormatter),
    },
    {
      label: "Nombre",
      field: "user.username",
      sortable: true,
      formatter: markRaw(UsernameFormatter),
    },
  ];

  if (showResults.value) {
    sessionResults.value.forEach((position, index) => {
      cols.push({
        label: `${index + 1}.`,
        subtitle: position.driver.code,
        field: `tipps.${index}`,
        formatter: markRaw(SessionResultFormatter),
        formatterProps: {
          position: index + 1,
          pointsByPosition: pointsByPosition.value,
          styleCodeInResults,
          driverTooltip,
        },
      });
    });
  }

  props.gp.sessions.forEach((ses) => {
    cols.push({
      label: ses.code,
      field: `score.bySession.${ses.id}`,
      sortable: true,
      sortKey: `score.bySession.${ses.id}`,
      formatter: markRaw(SessionPointsFormatter),
      formatterProps: {
        session: ses,
        winnersBySession: winnersBySession.value,
      },
    });
  });

  cols.push({
    label: "🎯",
    field: "score.totalHits",
    sortable: true,
    sortKey: "score.totalHits",
    formatter: markRaw(TotalHitsFormatter),
    formatterProps: {
      topScorerUsers: topScorerUsers.value,
      pointsByTopScorer: props.ruleSet.data.pointsByTopScorer || 0,
      sessions: props.gp.sessions,
      hitsBySession: hitsBySession.value,
      sessionHumanName,
    },
  });

  cols.push({
    label: "GP",
    field: "score.gp",
    sortable: true,
    sortKey: "score.gp",
    formatter: markRaw(GpPointsFormatter),
    formatterProps: {
      winnersOfGrandPrix: winnersOfGrandPrix.value,
    },
  });

  if (showAdvancedStadistics.value) {
    props.gp.sessions.forEach((ses) => {
      cols.push({
        label: `${ses.code}%`,
        field: `score.hitPercentageBySession.${ses.id}`,
        sortable: true,
        sortKey: `score.hitPercentageBySession.${ses.id}`,
        formatter: markRaw(PercentageFormatter),
      });
    });

    cols.push({
      label: "GP%",
      field: "score.hitPercentageInGP",
      sortable: true,
      sortKey: "score.hitPercentageInGP",
      formatter: markRaw(PercentageFormatter),
    });
  }

  cols.push({
    label: "TOT",
    field: "score.accumulated",
    sortable: true,
    sortKey: "score.accumulated",
    formatter: markRaw(BoldValueFormatter),
  });

  return cols;
};

const columns = computed<Column[]>(() => buildColumns());

const onUpdatedTipps = (event: {session: RaceSession; tipps: Driver[]}): void => {
  if (event.session.id !== props.session.id) return;
  const orderedTipps = event.tipps.map((driver, i) => ({position: i + 1, driver, raceSession: event.session} as RaceResult));
  const currentRow = tableData.value.find((row) => row.user.id === currentUser.id);
  if (currentRow) {
    currentRow.tipps = orderedTipps;
  }
};

const loadData = async (): Promise<void> => {
  loaded.value = false;
  thereAreFinishResults.value = false;
  sessionResults.value = [];
  pointsByPosition.value = {};
  totalHits.value = {};
  hitsBySession.value = {};
  tableData.value = [];
  winnersBySession.value = {};
  winnersOfGrandPrix.value = [];

  try {
    const results = await grandPrixService.getResults(props.gp, props.session);
    thereAreFinishResults.value = results.length > 0;

    const pronosticados = props.ruleSet.cantidadPilotosPronosticados(props.session);
    sessionResults.value = Array.from({length: pronosticados}, (_, position) => {
      if (position >= results.length) {
        return {position: position + 1, driver: {code: "---"} as Driver, raceSession: props.session};
      }
      return {
        position: position + 1,
        driver: results[position]!.driver,
        raceSession: results[position]!.raceSession,
      };
    });

    const tipps = await grandPrixService.getAllTipps(props.gp, props.session, currentCommunity);

    if (!props.session.isBeforeClosureDate()) {
      const score: ScoreCalculations = await scoreService.getPointsByPositionInGrandPrix(currentCommunity, props.gp, props.session);
      pointsByPosition.value = score.pointsByPosition;
      totalHits.value = score.totalHits;
      hitsBySession.value = score.hitsBySession;
    }

    tableData.value = props.communityMembers.map((comUser) => {
      const userScore = props.userPoints[comUser.user.id];
      const row: TableRow = {
        user: comUser.user,
        tipps: tipps[comUser.user.id] || [],
        score: {
          bySession: {},
          hitPercentageBySession: {},
          totalHits: totalHits.value[comUser.user.id] ?? 0,
          gp: 0,
          hitPercentageInGP: -1,
          accumulated: 0,
          standings: Number.MAX_SAFE_INTEGER,
          previousStandings: 0,
        },
      };

      if (userScore) {
        row.score.bySession = {...userScore.pointsBySession};
        row.score.hitPercentageBySession = {...userScore.hitPercentageBySession};
        row.score.hitPercentageInGP = userScore.hitPercentageInGP ?? -1;
        row.score.gp = userScore.pointsInGP || 0;
        row.score.accumulated = userScore.accumulatedPoints || 0;
        row.score.standings = userScore.standings || Number.MAX_SAFE_INTEGER;
        row.score.previousStandings = userScore.previousStandings || 0;
      }

      row.score.totalHits = totalHits.value[comUser.user.id] ?? row.score.totalHits;
      return row;
    });

    props.gp.sessions.forEach((ses) => {
      winnersBySession.value[ses.id] = findWinnerUserOfSession(ses);
    });
    winnersOfGrandPrix.value = findWinnerUserOfSession();
  } finally {
    loaded.value = true;
  }
};

onMounted(() => {
  emitter.on("updatedTipps", onUpdatedTipps);
});

onBeforeUnmount(() => {
  emitter.off("updatedTipps", onUpdatedTipps);
});

watch(
  () => [props.session.id, props.gp.id, props.communityMembers.length],
  () => {
    loadData();
  },
  {immediate: true}
);
</script>
