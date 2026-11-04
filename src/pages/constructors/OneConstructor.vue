<template>
  <PPage
    :title="team.name"
    variant="plain"
    :loading="isLoading"
    :not-found="!thereIsConstructor && `El constructor buscado con id ${$route.params.team} no ha sido encontrado`"
  >
    <div class="flex flex-col gap-5">
      <PCard>
        <div class="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div
            class="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-center text-xl font-black text-slate-800 dark:bg-slate-700 dark:text-slate-100"
            :style="heroStyle"
          >
            {{ team.name }}
          </div>
          <div class="grid flex-1 grid-cols-2 gap-4 text-slate-800 dark:text-slate-100 lg:grid-cols-3">
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Nombre completo
              </p>
              <p class="font-bold">
                {{ latest?.info.longname || team.longname || team.name }}
              </p>
            </div>
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Último monoplaza
              </p>
              <p class="font-bold">
                {{ latest?.info.carname || "—" }}
              </p>
            </div>
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Temporadas en PrognoSports
              </p>
              <p class="font-bold">
                {{ career.length }}
              </p>
            </div>
          </div>
        </div>
      </PCard>

      <PrognoAlert variant="info">
        Las estadísticas se calculan únicamente con los resultados registrados en PrognoSports,
        por lo que no reflejan toda la historia del equipo.
      </PrognoAlert>

      <PCard title="Historial en PrognoSports">
        <p
          v-if="!career.length"
          class="text-slate-600 dark:text-slate-300"
        >
          Este constructor aún no ha participado en ninguna temporada.
        </p>
        <div
          v-else
          class="overflow-x-auto"
        >
          <table class="w-full text-left text-sm text-slate-800 dark:text-slate-100">
            <thead class="text-xs uppercase text-slate-500 dark:text-slate-400">
              <tr>
                <th class="px-2 py-2">
                  Temporada
                </th>
                <th class="px-2 py-2">
                  Monoplaza
                </th>
                <th class="px-2 py-2">
                  Pilotos
                </th>
                <th class="px-2 py-2 text-center">
                  Victorias
                </th>
                <th class="px-2 py-2 text-center">
                  Podios
                </th>
                <th class="px-2 py-2 text-center">
                  Poles
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="entry in career"
                :key="entry.season.id"
                class="border-t border-slate-200 dark:border-slate-700"
              >
                <td class="px-2 py-2 font-semibold">
                  {{ entry.season.name }}
                </td>
                <td class="px-2 py-2">
                  <span
                    class="mr-2 inline-block h-3 w-1.5 rounded-sm"
                    :style="{ backgroundColor: '#' + entry.info.teamcolor }"
                  />{{ entry.info.carname || "—" }}
                </td>
                <td class="px-2 py-2">
                  <template
                    v-for="(d, index) in entry.drivers"
                    :key="d.id"
                  >
                    <template v-if="index > 0">
                      ,
                    </template>
                    <router-link
                      :to="{ name: 'driverDetails', params: { driver: d.id } }"
                      class="hover:underline"
                    >
                      {{ d.code }}
                    </router-link>
                  </template>
                </td>
                <template v-if="seasonStats[entry.season.id]">
                  <td class="px-2 py-2 text-center">
                    {{ seasonStats[entry.season.id].wins }}
                  </td>
                  <td class="px-2 py-2 text-center">
                    {{ seasonStats[entry.season.id].podiums }}
                  </td>
                  <td class="px-2 py-2 text-center">
                    {{ seasonStats[entry.season.id].poles }}
                  </td>
                </template>
                <template v-else>
                  <td
                    v-for="n in 3"
                    :key="n"
                    class="px-2 py-2 text-center text-slate-400"
                  >
                    —
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>

        <template v-if="career.length && isLoggedIn">
          <button
            v-if="!allLoaded"
            class="mt-4 cursor-pointer rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-cyan-600 disabled:cursor-wait disabled:opacity-60"
            :disabled="loadingAll"
            @click="loadAllSeasons"
          >
            {{ loadingAll ? `Calculando... (${loadedCount}/${career.length})` : "Calcular estadísticas de todas las temporadas" }}
          </button>
          <div
            v-else
            class="mt-4"
          >
            <h4 class="mb-2 font-semibold text-slate-800 dark:text-slate-100">
              Totales en PrognoSports
            </h4>
            <StatsGrid :stats="totals" />
            <CareerSummaryChart :seasons="careerSeasons" />
          </div>
        </template>
      </PCard>

      <PCard
        v-if="career.length"
        title="Detalle por temporada"
      >
        <PrognoAlert
          v-if="!isLoggedIn"
          variant="warning"
        >
          Debes <router-link
            :to="{ name: 'login' }"
            class="font-semibold underline"
          >
            iniciar sesión
          </router-link> para consultar los resultados.
        </PrognoAlert>
        <template v-else>
          <PSelect
            v-model="selectedSeasonId"
            label="Temporada"
            class="mb-4 max-w-xs"
          >
            <option
              v-for="entry in career"
              :key="entry.season.id"
              :value="entry.season.id"
            >
              {{ entry.season.name }}
            </option>
          </PSelect>

          <Loading v-if="loadingSeason" />
          <PrognoAlert
            v-else-if="seasonError"
            variant="danger"
          >
            {{ seasonError }}
          </PrognoAlert>
          <template v-else-if="selectedStats">
            <StatsGrid :stats="selectedStats" />

            <p
              v-if="!gpRows.length"
              class="mt-4 text-slate-600 dark:text-slate-300"
            >
              No hay resultados registrados para este constructor en la temporada.
            </p>
            <div
              v-else
              class="mt-4 overflow-x-auto"
            >
              <table class="w-full text-left text-sm text-slate-800 dark:text-slate-100">
                <thead class="text-xs uppercase text-slate-500 dark:text-slate-400">
                  <tr>
                    <th class="px-2 py-2">
                      Ronda
                    </th>
                    <th class="px-2 py-2">
                      Gran Premio
                    </th>
                    <th class="px-2 py-2">
                      Clasificación
                    </th>
                    <th class="px-2 py-2">
                      Carrera
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="row in gpRows"
                    :key="row.gp.id"
                    class="border-t border-slate-200 dark:border-slate-700"
                  >
                    <td class="px-2 py-2">
                      {{ row.gp.round }}
                    </td>
                    <td class="px-2 py-2">
                      <router-link
                        :to="grandPrixLink(row.gp)"
                        class="hover:underline"
                      >
                        {{ row.gp.name }}
                      </router-link>
                    </td>
                    <td class="px-2 py-2">
                      <span
                        v-for="r in row.qualify"
                        :key="r.code"
                        class="mr-3 whitespace-nowrap"
                      >{{ r.code }} <b>{{ formatPosition(r.position) }}</b></span>
                    </td>
                    <td class="px-2 py-2">
                      <span
                        v-for="r in row.race"
                        :key="r.code"
                        class="mr-3 whitespace-nowrap"
                      >{{ r.code }} <b :class="{ 'text-amber-500': r.position === 1 }">{{ formatPosition(r.position) }}</b></span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <SeasonResultsCharts
              v-if="gpRows.length"
              :grand-prixes="seasonGps"
              :series="positionSeries"
            />
          </template>
        </template>
      </PCard>
    </div>
  </PPage>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";

import { constructorService, driversService, notificationService, seasonService } from "@/_services";
import PCard from "@/components/lib/PCard.vue";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import PSelect from "@/components/lib/forms/PSelect.vue";
import CareerSummaryChart from "@/components/stats/CareerSummaryChart.vue";
import SeasonResultsCharts from "@/components/stats/SeasonResultsCharts.vue";
import StatsGrid from "@/components/stats/StatsGrid.vue";
import { USER_PALETTE } from "@/composables/charts/chartScales";
import type { CareerSeason, PositionSeries } from "@/composables/charts/resultsCharts";
import {
  computeStats,
  filterEntries,
  formatPosition,
  loadSeasonResults,
  sumStats,
  type SessionResults,
  type StatLine,
} from "@/composables/useSeasonResults";
import { useStyles } from "@/composables/useStyles";
import { useAuthStore } from "@/store/authStore";
import { Constructor } from "@/types/Constructor";
import { Driver } from "@/types/Driver";
import { GrandPrix } from "@/types/GrandPrix";
import { Season } from "@/types/Season";
import {grandPrixLink} from "@/utils/grandPrix";

defineOptions({ name: "OneConstructor" });

interface CareerEntry {
  season: Season;
  /** Datos del constructor en esa temporada (monoplaza, color...) */
  info: Constructor;
  drivers: Array<Driver>;
}

interface DriverPosition {
  code: string;
  position: number;
}

interface GpRow {
  gp: GrandPrix;
  qualify: Array<DriverPosition>;
  race: Array<DriverPosition>;
}

const route = useRoute();
const { isLoggedIn } = storeToRefs(useAuthStore());
const { invertColor } = useStyles();

const team = ref<Constructor>({ id: Number(route.params.team) } as Constructor);
const career = ref<Array<CareerEntry>>([]);
const isLoading = ref(true);
const thereIsConstructor = ref(false);

const selectedSeasonId = ref<number>(0);
const loadingSeason = ref(false);
const seasonError = ref("");
const seasonResults = ref<Array<SessionResults>>([]);
const seasonStats = ref<Record<number, StatLine>>({});
const loadingAll = ref(false);

const latest = computed(() => career.value[0]);
const heroStyle = computed(() => latest.value?.info.teamcolor
  ? { backgroundColor: "#" + latest.value.info.teamcolor, color: invertColor(latest.value.info.teamcolor) }
  : {});
const loadedCount = computed(() => Object.keys(seasonStats.value).length);
const allLoaded = computed(() => career.value.length > 0 && loadedCount.value >= career.value.length);
const totals = computed(() => sumStats(Object.values(seasonStats.value)));
const selectedStats = computed(() => seasonStats.value[selectedSeasonId.value]);

const gpRows = computed((): Array<GpRow> => {
  const rows = new Map<number, GpRow>();
  for (const entry of filterEntries(seasonResults.value, isTeamResult)) {
    const row = rows.get(entry.gp.id) ?? { gp: entry.gp, qualify: [], race: [] };
    const item = { code: entry.result.driver.code, position: entry.position };
    if (entry.sessionName === "QUALIFY") row.qualify.push(item);
    if (entry.sessionName === "RACE") row.race.push(item);
    rows.set(entry.gp.id, row);
  }
  return [...rows.values()].sort((a, b) => a.gp.round - b.gp.round);
});

const seasonGps = computed(() => gpRows.value.map((row) => row.gp));

/** Por cada piloto del equipo, su línea de carrera (sólida) y de clasificación (discontinua) en el mismo color */
const positionSeries = computed((): Array<PositionSeries> => {
  const codes = [...new Set(gpRows.value.flatMap((row) => [...row.race, ...row.qualify].map((r) => r.code)))];
  const valuesOf = (code: string, pick: (row: GpRow) => Array<DriverPosition>) => new Map(gpRows.value.map((row) => [
    row.gp.code,
    pick(row).find((r) => r.code === code)?.position ?? null,
  ]));
  return codes.flatMap((code, index): Array<PositionSeries> => {
    const color = USER_PALETTE[index % USER_PALETTE.length]!;
    return [
      { key: `${code}-race`, label: `${code} · Carrera`, color, session: "RACE", values: valuesOf(code, (row) => row.race) },
      { key: `${code}-qualify`, label: `${code} · Clasificación`, color, dash: "6 4", session: "QUALIFY", values: valuesOf(code, (row) => row.qualify) },
    ];
  });
});

// Cronológico: `career` va de la temporada más reciente a la más antigua
const careerSeasons = computed((): Array<CareerSeason> => [...career.value]
  .reverse()
  .filter((entry) => seasonStats.value[entry.season.id])
  .map((entry) => ({ name: entry.season.name, stats: seasonStats.value[entry.season.id] })));

function isTeamResult(result: { driver: Driver }): boolean {
  return Number(result.driver.team?.id) === Number(team.value.id);
}

async function computeSeason(season: Season): Promise<Array<SessionResults>> {
  const sessions = await loadSeasonResults(season);
  seasonStats.value[season.id] = computeStats(filterEntries(sessions, isTeamResult));
  return sessions;
}

async function selectSeason(seasonId: number): Promise<void> {
  const entry = career.value.find((c) => c.season.id === seasonId);
  if (!entry || !isLoggedIn.value) return;

  loadingSeason.value = true;
  seasonError.value = "";
  try {
    seasonResults.value = await computeSeason(entry.season);
  } catch (error: any) {
    seasonError.value = error?.message ?? "No se han podido cargar los resultados de la temporada";
  } finally {
    loadingSeason.value = false;
  }
}

async function loadAllSeasons(): Promise<void> {
  loadingAll.value = true;
  try {
    for (const entry of career.value) {
      if (!seasonStats.value[entry.season.id]) {
        await computeSeason(entry.season);
      }
    }
  } catch (error: any) {
    notificationService.showNotification(error?.message ?? "No se han podido calcular las estadísticas", "error");
  } finally {
    loadingAll.value = false;
  }
}

async function loadCareer(teamId: number): Promise<Array<CareerEntry>> {
  const seasons = await seasonService.getSeasonList().catch(() => [] as Array<Season>);
  const entries = await Promise.all(seasons.map(async (season): Promise<CareerEntry | undefined> => {
    const teams = await constructorService.getConstructorsInSeason(season).catch(() => [] as Array<Constructor>);
    const info = teams.find((t) => Number(t.id) === teamId);
    if (!info) return undefined;
    const drivers = await driversService.getDriversInSeason(season).catch(() => [] as Array<Driver>);
    return { season, info, drivers: drivers.filter((d) => Number(d.team?.id) === teamId) };
  }));
  return entries
    .filter((e): e is CareerEntry => e !== undefined)
    .sort((a, b) => b.season.name.localeCompare(a.season.name, undefined, { numeric: true }));
}

watch(selectedSeasonId, (id) => selectSeason(id));

onMounted(async () => {
  try {
    team.value = await constructorService.getConstructor(String(route.params.team));
    thereIsConstructor.value = true;
    career.value = await loadCareer(Number(team.value.id));
    if (career.value.length) {
      selectedSeasonId.value = career.value[0].season.id;
    }
  } catch (error: any) {
    thereIsConstructor.value = false;
    notificationService.showNotification(error?.message, "error");
  } finally {
    isLoading.value = false;
  }
});

defineExpose({ team, career, isLoading, thereIsConstructor });
</script>
