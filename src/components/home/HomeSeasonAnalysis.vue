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

const props = defineProps<{
  username: string;
  grandPrixes: readonly GrandPrix[];
  pointsByGp: PointsByGp;
}>();

// Home desmonta este componente al recargar los datos (cambio de comunidad), así que los filtros se reinician y el
// usuario elegido nunca puede quedar fuera de la comunidad.
// Valores del select que no son un usuario: el select necesita un valor no vacío en cada opción
const AUTO = "__auto__";
const NOBODY = "__nobody__";

const tab = ref<AnalysisTab>("summary");
const requestedMode = ref<SummaryMode>("leader");
const windowSize = ref<HomeWindow>("season");
const compareWith = ref<string>(AUTO);

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

// Solo los GPs con puntos: así las gráficas llenan el ancho y «últimos 5» son los últimos 5 jugados
const played = computed(() => playedGps(props.grandPrixes, props.pointsByGp));
const shown = computed(() => windowGps(played.value, windowSize.value));

const compareOptions = computed(() => rankedUsernames(played.value, props.pointsByGp).filter((name) => name !== props.username));
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

const summaryTitle = computed(() => {
  switch (mode.value) {
    case "ahead":
      if (!isAutomaticRival.value) {
        return `Tú contra ${rivalName.value}`;
      }
      return automatic.value?.relation === "behind"
        ? `Tú contra ${rivalName.value} (justo detrás)`
        : `Tú contra ${rivalName.value} (justo delante)`;
    case "position":
      return "Tu posición tras cada GP";
    default:
      return "Tu diferencia con el líder";
  }
});

const summaryAriaLabel = computed(() => {
  switch (mode.value) {
    case "ahead":
      return `Diferencia de puntos acumulados con ${rivalName.value}, y tus puntos por Gran Premio desglosados por sesión`;
    case "position":
      return "Tu posición en la clasificación tras cada Gran Premio, y tus puntos por Gran Premio desglosados por sesión";
    default:
      return "Diferencia de puntos acumulados con el líder y con la media, y tus puntos por Gran Premio desglosados por sesión";
  }
});

const summaryChart = computed(() => buildHomeSummaryChart({
  mode: mode.value,
  grandPrixes: shown.value,
  username: props.username,
  me: me.value,
  community: community.value,
  winners: winners.value,
  rival: mode.value === "leader" ? undefined : rival.value ?? undefined,
}));

// --- Aciertos y sesiones ---
const hitsChart = computed(() => buildHomeHitsChart({
  grandPrixes: shown.value,
  me: me.value,
  community: community.value,
  compare: rival.value ?? undefined,
}));

const mineBySession = computed(() => sessionAverages(shown.value, props.pointsByGp, props.username));
const communityBySession = computed(() => sessionAverages(shown.value, props.pointsByGp, null));
const sessionsChart = computed(() => buildHomeSessionsChart({
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
  <PCard title="Tu temporada">
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
        aria-label="Análisis de tu temporada que se muestra"
      />

      <div
        v-if="showFilters"
        class="mt-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-2"
      >
        <PField
          label="Comparar con"
          class="min-w-[12rem] max-w-full"
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
              aria-label="Referencia con la que comparar tu progreso"
            />
          </div>
          <div class="mt-3">
            <HomePositionBadge
              v-if="mode === 'position'"
              :position="position"
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
            Tu porcentaje de acierto
          </h2>
          <PChart
            :definition="hitsChart"
            aria-label="Tu porcentaje de acierto en cada Gran Premio frente a la media de la comunidad"
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
            Tu punto fuerte es <strong>{{ strongSession.name }}</strong>: sacas
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
            {{ rivalName ? `Tú contra ${rivalName}` : "Cara a cara" }}
          </h2>
          <HomeHeadToHead
            :grand-prixes="shown"
            :me="me"
            :rival="rival"
          />
        </template>

        <template v-else>
          <h2 class="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Récords de la temporada
          </h2>
          <HomeRecords
            :records="records"
            :form="form"
          />
        </template>
      </section>
    </template>

    <PButton
      class="mt-4"
      label="Ir al Ranking"
      expanded
      type="soft"
      color="info"
      to="/ranking"
    />
  </PCard>
</template>
