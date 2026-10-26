<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { User } from "@/types/User";
import { useHomeSeason } from "@/composables/useHomeSeason";
import {
  communitySeries,
  computeForm,
  gpWinners,
  type HomeWindow,
  latestPosition,
  playedGps,
  rankedUsernames,
  sessionAverages,
  userSeries,
  windowGps,
} from "@/composables/charts/homeSeason";
import { HOME_CHART_HEIGHT } from "@/composables/charts/homeStyle";
import { buildHomePointsChart } from "@/composables/charts/homePointsChart";
import { buildHomePositionChart } from "@/composables/charts/homePositionChart";
import {
  buildHomeHitsChart,
  buildHomeSessionsChart,
  HITS_CHART_HEIGHT,
  SESSIONS_CHART_HEIGHT,
} from "@/composables/charts/homeHitsChart";
import Loading from "@/components/lib/Loading.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PField from "@/components/lib/forms/PField.vue";
import PSelect from "@/components/lib/forms/PSelect.vue";
import PSegmentedControl from "@/components/lib/forms/PSegmentedControl.vue";
import PChart from "@/components/lib/charts/PChart.vue";
import HomeFormStats from "@/components/home/HomeFormStats.vue";
import HomePositionBadge from "@/components/home/HomePositionBadge.vue";

type HomeTab = "points" | "position" | "hits";

const props = defineProps<{
  user: User;
}>();

const { loading, grandPrixes, pointsByGp } = useHomeSeason();

const tab = ref<HomeTab>("points");
const windowSize = ref<HomeWindow>("season");
// El select necesita un valor no vacío para poder volver a "Nadie"
const NO_ONE = "__no_one__";
const compareWith = ref<string>(NO_ONE);

const tabOptions: { value: HomeTab; label: string }[] = [
  { value: "points", label: "Puntos" },
  { value: "position", label: "Posición" },
  { value: "hits", label: "Aciertos" },
];
const windowOptions: { value: HomeWindow; label: string }[] = [
  { value: "season", label: "Temporada" },
  { value: "last5", label: "Últimos 5 GP" },
];

const username = computed(() => props.user.username);

// Solo los GPs con puntos: así las gráficas llenan el ancho y "últimos 5" son los últimos 5 jugados
const played = computed(() => playedGps(grandPrixes.value, pointsByGp.value));
const shown = computed(() => windowGps(played.value, windowSize.value));

const compareOptions = computed(() => rankedUsernames(played.value, pointsByGp.value).filter((name) => name !== username.value));

// Si cambia la comunidad o la temporada y el usuario elegido ya no está, se vuelve a "Nadie"
watch(compareOptions, (options) => {
  if (compareWith.value !== NO_ONE && !options.includes(compareWith.value)) {
    compareWith.value = NO_ONE;
  }
});

const me = computed(() => userSeries(shown.value, pointsByGp.value, username.value));
const community = computed(() => communitySeries(shown.value, pointsByGp.value));
const winners = computed(() => gpWinners(shown.value, pointsByGp.value));
const compareName = computed(() => (compareWith.value === NO_ONE ? null : compareWith.value));
const compare = computed(() => (
  compareName.value ? { name: compareName.value, series: userSeries(shown.value, pointsByGp.value, compareName.value) } : undefined
));

// La forma y la posición actual no dependen de la ventana elegida: se calculan con toda la temporada
const fullMe = computed(() => userSeries(played.value, pointsByGp.value, username.value));
const form = computed(() => computeForm(fullMe.value, communitySeries(played.value, pointsByGp.value)));
const position = computed(() => latestPosition(fullMe.value));

const pointsChart = computed(() => buildHomePointsChart({
  grandPrixes: shown.value,
  username: username.value,
  me: me.value,
  community: community.value,
  winners: winners.value,
  compare: compare.value,
}));
const positionChart = computed(() => buildHomePositionChart({
  grandPrixes: shown.value,
  me: me.value,
  compare: compare.value,
}));
const hitsChart = computed(() => buildHomeHitsChart({
  grandPrixes: shown.value,
  me: me.value,
  community: community.value,
  compare: compare.value,
}));
const sessionsChart = computed(() => buildHomeSessionsChart({
  me: sessionAverages(shown.value, pointsByGp.value, username.value),
  community: sessionAverages(shown.value, pointsByGp.value, null),
  compare: compareName.value
    ? { name: compareName.value, averages: sessionAverages(shown.value, pointsByGp.value, compareName.value) }
    : undefined,
}));
</script>

<template>
  <div id="pointsChart">
    <Loading
      v-if="loading"
      class="m-4"
    />
    <p
      v-else-if="played.length === 0"
      class="m-4 text-center text-sm text-gray-600 dark:text-gray-400"
    >
      Aún no hay puntos que mostrar en esta temporada
    </p>
    <template v-else>
      <div class="mt-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <PField
          label="Comparar con"
          class="min-w-[12rem] max-w-full"
        >
          <PSelect v-model="compareWith">
            <option :value="NO_ONE">
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

      <PSegmentedControl
        v-model="tab"
        class="mt-3"
        :options="tabOptions"
        aria-label="Gráfica que se muestra"
      />

      <section class="mt-3">
        <PChart
          v-if="tab === 'points'"
          :definition="pointsChart"
          aria-label="Tus puntos acumulados frente al líder y la media, y tus puntos por Gran Premio desglosados por sesión"
          :height="HOME_CHART_HEIGHT"
        />

        <template v-else-if="tab === 'position'">
          <HomePositionBadge :position="position" />
          <PChart
            :definition="positionChart"
            aria-label="Tu posición en la clasificación tras cada Gran Premio"
            :height="HOME_CHART_HEIGHT"
          />
        </template>

        <template v-else>
          <PChart
            :definition="hitsChart"
            aria-label="Tu porcentaje de acierto en cada Gran Premio frente a la media de la comunidad"
            :height="HITS_CHART_HEIGHT"
          />
          <h4 class="mb-1 mt-4 text-base font-semibold text-gray-800 dark:text-gray-200">
            Media de puntos por sesión
          </h4>
          <PChart
            :definition="sessionsChart"
            aria-label="Media de puntos por tipo de sesión, frente a la comunidad"
            :height="SESSIONS_CHART_HEIGHT"
          />
          <HomeFormStats :form="form" />
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
  </div>
</template>
