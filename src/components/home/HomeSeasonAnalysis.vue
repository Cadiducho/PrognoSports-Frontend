<script setup lang="ts">
import { computed, ref } from "vue";
import {
  communitySeries,
  computeForm,
  gpWinners,
  type HomeWindow,
  latestPosition,
  playedGps,
  type PointsByGp,
  rankedUsernames,
  sessionAverages,
  userAhead,
  userSeries,
  windowGps,
} from "@/composables/charts/homeSeason";
import { seasonRecords } from "@/composables/charts/homeStats";
import { HOME_CHART_HEIGHT } from "@/composables/charts/homeStyle";
import { buildHomeSummaryChart, type SummaryMode } from "@/composables/charts/homeSummaryChart";
import { buildHomeHitsChart, buildHomeSessionsChart, HITS_CHART_HEIGHT, SESSIONS_CHART_HEIGHT } from "@/composables/charts/homeHitsChart";
import type { GrandPrix } from "@/types/GrandPrix";
import PCard from "@/components/lib/PCard.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PField from "@/components/lib/forms/PField.vue";
import PSelect from "@/components/lib/forms/PSelect.vue";
import PSegmentedControl from "@/components/lib/forms/PSegmentedControl.vue";
import PChart from "@/components/lib/charts/PChart.vue";
import HomeHeadToHead from "@/components/home/HomeHeadToHead.vue";
import HomePositionBadge from "@/components/home/HomePositionBadge.vue";
import HomeRecords from "@/components/home/HomeRecords.vue";

type AnalysisTab = "summary" | "hits" | "sessions" | "headToHead" | "records";

const props = withDefaults(defineProps<{
  username: string;
  grandPrixes: readonly GrandPrix[];
  pointsByGp: PointsByGp;
  /** false al mostrar el perfil de otro usuario: textos en tercera persona y series con su nombre en lugar de "Tú" */
  own?: boolean;
  /** Usuario con el que se compara de entrada, si está en la clasificación */
  initialCompare?: string;
  showRankingButton?: boolean;
}>(), {
  own: true,
  initialCompare: undefined,
  showRankingButton: true,
});

// Home y el perfil desmontan este componente al recargar los datos (cambio de comunidad), así que los filtros se
// reinician y el usuario elegido nunca puede quedar fuera de la comunidad.
// Valores del select que no son un usuario: el select necesita un valor no vacío en cada opción
const AUTO = "__auto__";
const NOBODY = "__nobody__";

// Solo los GPs con puntos: así las gráficas llenan el ancho y «últimos 5» son los últimos 5 jugados
const played = computed(() => playedGps(props.grandPrixes, props.pointsByGp));
const compareOptions = computed(() => rankedUsernames(played.value, props.pointsByGp).filter((name) => name !== props.username));

const tab = ref<AnalysisTab>("summary");
const requestedMode = ref<SummaryMode>("leader");
const windowSize = ref<HomeWindow>("season");
const compareWith = ref<string>(
  props.initialCompare && compareOptions.value.includes(props.initialCompare) ? props.initialCompare : AUTO,
);

// En el perfil de otro usuario su serie se llama por su nombre en lugar de "Tú"
const meLabel = computed(() => (props.own ? undefined : props.username));
const cardTitle = computed(() => (props.own ? "Tu temporada" : `Temporada de ${props.username}`));

const tabOptions: { value: AnalysisTab; label: string }[] = [
  { value: "summary", label: "Resumen" },
  { value: "hits", label: "Aciertos" },
  { value: "sessions", label: "Sesiones" },
  { value: "headToHead", label: "Cara a cara" },
  { value: "records", label: "Récords" },
];
const windowOptions: { value: HomeWindow; label: string }[] = [
  { value: "season", label: "Temporada" },
  { value: "last5", label: "Últimos 5 GP" },
];

const shown = computed(() => windowGps(played.value, windowSize.value));

const automatic = computed(() => userAhead(played.value, props.pointsByGp, props.username));

/** Con quién se compara: quien va justo delante (o detrás si eres el líder), el usuario elegido o nadie */
const rivalName = computed<string | null>(() => {
  if (compareWith.value === NOBODY) {
    return null;
  }
  return compareWith.value === AUTO ? automatic.value?.username ?? null : compareWith.value;
});
const isAutomaticRival = computed(() => compareWith.value === AUTO && automatic.value !== null);

const autoLabel = computed(() => (automatic.value?.relation === "behind" ? "El de detrás" : "El de delante"));
const rivalSeries = computed(() => (rivalName.value ? userSeries(shown.value, props.pointsByGp, rivalName.value) : null));
const rival = computed(() => (rivalName.value && rivalSeries.value ? { name: rivalName.value, series: rivalSeries.value } : null));

const me = computed(() => userSeries(shown.value, props.pointsByGp, props.username));
const community = computed(() => communitySeries(shown.value, props.pointsByGp));
const winners = computed(() => gpWinners(shown.value, props.pointsByGp));

// La forma, el puesto actual y los récords no dependen de la ventana elegida: se calculan con toda la temporada
const fullMe = computed(() => userSeries(played.value, props.pointsByGp, props.username));
const form = computed(() => computeForm(fullMe.value, communitySeries(played.value, props.pointsByGp)));
const position = computed(() => latestPosition(fullMe.value));
const records = computed(() => seasonRecords(played.value, props.pointsByGp, props.username));

// --- Resumen ---
const aheadLabel = computed(() => {
  if (!rivalName.value) {
    return "";
  }
  if (!isAutomaticRival.value) {
    return `Con ${rivalName.value}`;
  }
  return automatic.value?.relation === "behind" ? "Con el de detrás" : "Con el de delante";
});

const modeOptions = computed<{ value: SummaryMode; label: string }[]>(() => [
  { value: "leader", label: "Con el líder" },
  ...(rivalName.value ? [{ value: "ahead" as const, label: aheadLabel.value }] : []),
  { value: "position", label: "Posición" },
]);

// Si ya no hay con quién comparar, el modo vuelve al líder
const mode = computed<SummaryMode>({
  get: () => (requestedMode.value === "ahead" && !rivalName.value ? "leader" : requestedMode.value),
  set: (value) => {
    requestedMode.value = value;
  },
});

// Sujeto de los títulos: «Tú» en la Home y en tu perfil, el nombre del usuario en el perfil de otro
const subject = computed(() => (props.own ? "Tú" : props.username));
const yourPoints = computed(() => (props.own ? "tus puntos" : `los puntos de ${props.username}`));

const summaryTitle = computed(() => {
  switch (mode.value) {
    case "ahead":
      if (!isAutomaticRival.value) {
        return `${subject.value} contra ${rivalName.value}`;
      }
      return automatic.value?.relation === "behind"
        ? `${subject.value} contra ${rivalName.value} (justo detrás)`
        : `${subject.value} contra ${rivalName.value} (justo delante)`;
    case "position":
      return props.own ? "Tu posición tras cada GP" : `Posición de ${props.username} tras cada GP`;
    default:
      return props.own ? "Tu diferencia con el líder" : `Diferencia de ${props.username} con el líder`;
  }
});

const summaryAriaLabel = computed(() => {
  switch (mode.value) {
    case "ahead":
      return `Diferencia de puntos acumulados con ${rivalName.value}, y ${yourPoints.value} por Gran Premio desglosados por sesión`;
    case "position":
      return `${props.own ? "Tu posición" : `Posición de ${props.username}`} en la clasificación tras cada Gran Premio, y ${yourPoints.value} por Gran Premio desglosados por sesión`;
    default:
      return `Diferencia de puntos acumulados con el líder y con la media, y ${yourPoints.value} por Gran Premio desglosados por sesión`;
  }
});

const summaryChart = computed(() => buildHomeSummaryChart({
  mode: mode.value,
  meLabel: meLabel.value,
  grandPrixes: shown.value,
  username: props.username,
  me: me.value,
  community: community.value,
  winners: winners.value,
  rival: mode.value === "leader" ? undefined : rival.value ?? undefined,
}));

// --- Aciertos y sesiones ---
const hitsChart = computed(() => buildHomeHitsChart({
  meLabel: meLabel.value,
  grandPrixes: shown.value,
  me: me.value,
  community: community.value,
  compare: rival.value ?? undefined,
}));

const mineBySession = computed(() => sessionAverages(shown.value, props.pointsByGp, props.username));
const communityBySession = computed(() => sessionAverages(shown.value, props.pointsByGp, null));
const sessionsChart = computed(() => buildHomeSessionsChart({
  meLabel: meLabel.value,
  me: mineBySession.value,
  community: communityBySession.value,
  compare: rivalName.value
    ? { name: rivalName.value, averages: sessionAverages(shown.value, props.pointsByGp, rivalName.value) }
    : undefined,
}));

/** La sesión en la que más superas la media de la comunidad, si la superas en alguna */
const strongSession = computed(() => {
  const averages = new Map(communityBySession.value.map((entry) => [entry.sessionId, entry.average]));
  const gains = mineBySession.value
    .flatMap((entry) => (averages.has(entry.sessionId) ? [{ name: entry.sessionName, gain: entry.average - averages.get(entry.sessionId)! }] : []))
    .sort((a, b) => b.gain - a.gain);
  const best = gains[0];
  return best && best.gain > 0 ? { name: best.name, gain: Math.round(best.gain * 10) / 10 } : null;
});

const showFilters = computed(() => tab.value !== "records");
</script>

<template>
  <PCard :title="cardTitle">
    <p
      v-if="played.length === 0"
      class="text-center text-sm text-gray-600 dark:text-gray-400"
    >
      Aún no hay puntos que mostrar en esta temporada
    </p>
    <template v-else>
      <PSegmentedControl
        v-model="tab"
        :options="tabOptions"
        :aria-label="own ? 'Análisis de tu temporada que se muestra' : `Análisis de la temporada de ${username} que se muestra`"
      />

      <div
        v-if="showFilters"
        class="mt-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-2"
      >
        <PField
          label="Comparar con"
          class="min-w-48 max-w-full"
        >
          <PSelect v-model="compareWith">
            <option :value="AUTO">
              {{ automatic ? `${autoLabel} (${automatic.username})` : "Sin rival disponible" }}
            </option>
            <option :value="NOBODY">
              Nadie
            </option>
            <option
              v-for="name in compareOptions"
              :key="name"
              :value="name"
            >
              {{ name }}
            </option>
          </PSelect>
        </PField>
        <PSegmentedControl
          v-model="windowSize"
          :options="windowOptions"
          aria-label="Periodo mostrado en las gráficas"
        />
      </div>

      <section class="mt-4">
        <template v-if="tab === 'summary'">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {{ summaryTitle }}
            </h2>
            <PSegmentedControl
              v-model="mode"
              :options="modeOptions"
              :aria-label="own ? 'Referencia con la que comparar tu progreso' : `Referencia con la que comparar el progreso de ${username}`"
            />
          </div>
          <div class="mt-3">
            <HomePositionBadge
              v-if="mode === 'position'"
              :position="position"
              :own="own"
            />
            <PChart
              :definition="summaryChart"
              :aria-label="summaryAriaLabel"
              :height="HOME_CHART_HEIGHT"
            />
          </div>
        </template>

        <template v-else-if="tab === 'hits'">
          <h2 class="mb-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
            {{ own ? "Tu porcentaje de acierto" : `Porcentaje de acierto de ${username}` }}
          </h2>
          <PChart
            :definition="hitsChart"
            :aria-label="`${own ? 'Tu porcentaje' : `Porcentaje de ${username}`} de acierto en cada Gran Premio frente a la media de la comunidad`"
            :height="HITS_CHART_HEIGHT"
          />
        </template>

        <template v-else-if="tab === 'sessions'">
          <h2 class="mb-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Media de puntos por sesión
          </h2>
          <p
            v-if="strongSession"
            class="mb-2 text-sm text-gray-700 dark:text-gray-300"
          >
            {{ own ? "Tu" : "Su" }} punto fuerte es <strong>{{ strongSession.name }}</strong>: {{ own ? "sacas" : "saca" }}
            {{ strongSession.gain.toLocaleString("es-ES") }} puntos de media más que la comunidad.
          </p>
          <PChart
            :definition="sessionsChart"
            aria-label="Media de puntos por tipo de sesión, frente a la comunidad"
            :height="SESSIONS_CHART_HEIGHT"
          />
        </template>

        <template v-else-if="tab === 'headToHead'">
          <h2 class="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
            {{ rivalName ? `${subject} contra ${rivalName}` : "Cara a cara" }}
          </h2>
          <HomeHeadToHead
            :grand-prixes="shown"
            :me="me"
            :rival="rival"
            :own="own"
            :username="username"
          />
        </template>

        <template v-else>
          <h2 class="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Récords de la temporada
          </h2>
          <HomeRecords
            :records="records"
            :form="form"
            :own="own"
          />
        </template>
      </section>
    </template>

    <PButton
      v-if="showRankingButton"
      class="mt-4"
      label="Ir al Ranking"
      expanded
      type="soft"
      color="info"
      to="/ranking"
    />
  </PCard>
</template>
