<template>
  <PPage
    :title="fullName"
    variant="plain"
    :loading="isLoading"
    :not-found="!thereIsDriver && `El piloto buscado con id ${$route.params.driver} no ha sido encontrado`"
  >
    <div class="flex flex-col gap-5">
      <PCard>
        <div class="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div
            class="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100"
            :style="heroStyle"
          >
            <span class="text-3xl font-black tracking-wider">{{ driver.code }}</span>
            <span
              v-if="latestCareer?.driver.number"
              class="text-sm font-semibold opacity-90"
            >#{{ latestCareer.driver.number }}</span>
          </div>
          <div class="grid flex-1 grid-cols-2 gap-4 text-slate-800 dark:text-slate-100 lg:grid-cols-4">
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Nacionalidad
              </p>
              <p class="font-bold">
                {{ driver.nationality || "—" }}
              </p>
            </div>
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Fecha de nacimiento
              </p>
              <p class="font-bold">
                {{ birthText }}
              </p>
            </div>
            <div>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Equipo más reciente
              </p>
              <p class="font-bold">
                <router-link
                  v-if="latestCareer?.driver.team"
                  :to="{ name: 'constructorDetails', params: { team: latestCareer.driver.team.id } }"
                  class="hover:underline"
                >
                  {{ latestCareer.driver.team.name }}
                </router-link>
                <template v-else>
                  —
                </template>
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
        por lo que no reflejan toda la carrera deportiva del piloto.
      </PrognoAlert>

      <PCard title="Trayectoria en PrognoSports">
        <p
          v-if="!career.length"
          class="text-slate-600 dark:text-slate-300"
        >
          Este piloto aún no ha participado en ninguna temporada.
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
                  Equipo
                </th>
                <th class="px-2 py-2 text-center">
                  Dorsal
                </th>
                <th class="px-2 py-2 text-center">
                  GPs
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
                  <router-link
                    v-if="entry.driver.team"
                    :to="{ name: 'constructorDetails', params: { team: entry.driver.team.id } }"
                    class="inline-flex items-center gap-2 hover:underline"
                  >
                    <span
                      class="inline-block h-3 w-1.5 rounded-sm"
                      :style="{ backgroundColor: '#' + entry.driver.team.teamcolor }"
                    />
                    {{ entry.driver.team.longname || entry.driver.team.name }}
                  </router-link>
                  <template v-else>
                    —
                  </template>
                </td>
                <td class="px-2 py-2 text-center">
                  {{ entry.driver.number ?? "—" }}
                </td>
                <template v-if="seasonStats[entry.season.id]">
                  <td class="px-2 py-2 text-center">
                    {{ seasonStats[entry.season.id].gps }}
                  </td>
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
                    v-for="n in 4"
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
              No hay resultados registrados para este piloto en la temporada.
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
                    <th class="px-2 py-2 text-center">
                      Clasificación
                    </th>
                    <th class="px-2 py-2 text-center">
                      Sprint
                    </th>
                    <th class="px-2 py-2 text-center">
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
                    <td class="px-2 py-2 text-center">
                      {{ formatPosition(row.qualify) }}
                    </td>
                    <td class="px-2 py-2 text-center">
                      {{ formatPosition(row.sprint) }}
                    </td>
                    <td
                      class="px-2 py-2 text-center font-semibold"
                      :class="{ 'text-amber-500': row.race === 1 }"
                    >
                      {{ formatPosition(row.race) }}
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

import { driversService, notificationService } from "@/_services";
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
import { Driver } from "@/types/Driver";
import { GrandPrix } from "@/types/GrandPrix";
import { Season } from "@/types/Season";
import { fetchSeasonList } from "@/queries/seasons";
import {grandPrixLink} from "@/utils/grandPrix";

defineOptions({ name: "OneDriver" });

interface CareerEntry {
  season: Season;
  driver: Driver;
}

interface GpRow {
  gp: GrandPrix;
  qualify?: number;
  sprint?: number;
  race?: number;
}

const route = useRoute();
const { isLoggedIn } = storeToRefs(useAuthStore());
const { styleDorsal } = useStyles();

// El parámetro puede ser el id o "Nombre_Apellido"; el backend acepta ambos
const driver = ref<Driver>({ id: route.params.driver } as unknown as Driver);
const career = ref<Array<CareerEntry>>([]);
const isLoading = ref(true);
const thereIsDriver = ref(false);

const selectedSeasonId = ref<number>(0);
const loadingSeason = ref(false);
const seasonError = ref("");
const seasonResults = ref<Array<SessionResults>>([]);
const seasonStats = ref<Record<number, StatLine>>({});
const loadingAll = ref(false);

const fullName = computed(() => driver.value.firstname ? `${driver.value.firstname} ${driver.value.lastname}` : "Piloto");
const latestCareer = computed(() => career.value[0]);
const heroStyle = computed(() => latestCareer.value ? styleDorsal(latestCareer.value.driver) : {});
const birthText = computed(() => {
  if (!driver.value.birth) return "—";
  const birth = new Date(driver.value.birth);
  if (isNaN(birth.getTime())) return "—";
  const age = Math.floor((Date.now() - birth.getTime()) / (365.25 * 24 * 3600 * 1000));
  return `${birth.toLocaleDateString("es-ES", { dateStyle: "long" })} (${age} años)`;
});

const loadedCount = computed(() => Object.keys(seasonStats.value).length);
const allLoaded = computed(() => career.value.length > 0 && loadedCount.value >= career.value.length);
const totals = computed(() => sumStats(Object.values(seasonStats.value)));
const selectedStats = computed(() => seasonStats.value[selectedSeasonId.value]);

const gpRows = computed((): Array<GpRow> => {
  const driverId = Number(driver.value.id);
  const rows = new Map<number, GpRow>();
  for (const entry of filterEntries(seasonResults.value, (r) => Number(r.driver.id) === driverId)) {
    const row = rows.get(entry.gp.id) ?? { gp: entry.gp };
    if (entry.sessionName === "QUALIFY") row.qualify = entry.position;
    if (entry.sessionName === "SPRINT_RACE") row.sprint = entry.position;
    if (entry.sessionName === "RACE") row.race = entry.position;
    rows.set(entry.gp.id, row);
  }
  return [...rows.values()].sort((a, b) => a.gp.round - b.gp.round);
});

const seasonGps = computed(() => gpRows.value.map((row) => row.gp));

const positionSeries = computed((): Array<PositionSeries> => {
  const valuesOf = (pick: (row: GpRow) => number | undefined) => new Map(gpRows.value.map((row) => [row.gp.code, pick(row) ?? null]));
  const series: Array<PositionSeries> = [
    { key: "race", label: "Carrera", color: USER_PALETTE[0]!, session: "RACE", values: valuesOf((row) => row.race) },
    { key: "qualify", label: "Clasificación", color: USER_PALETTE[3]!, dash: "6 4", session: "QUALIFY", values: valuesOf((row) => row.qualify) },
  ];
  if (gpRows.value.some((row) => row.sprint)) {
    series.push({ key: "sprint", label: "Sprint", color: USER_PALETTE[2]!, dash: "2 4", session: "SPRINT_RACE", values: valuesOf((row) => row.sprint) });
  }
  return series;
});

// Cronológico: `career` va de la temporada más reciente a la más antigua
const careerSeasons = computed((): Array<CareerSeason> => [...career.value]
  .reverse()
  .filter((entry) => seasonStats.value[entry.season.id])
  .map((entry) => ({ name: entry.season.name, stats: seasonStats.value[entry.season.id] })));

async function computeSeason(season: Season): Promise<Array<SessionResults>> {
  const sessions = await loadSeasonResults(season);
  const driverId = Number(driver.value.id);
  seasonStats.value[season.id] = computeStats(filterEntries(sessions, (r) => Number(r.driver.id) === driverId));
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

async function loadCareer(driverId: string): Promise<Array<CareerEntry>> {
  const seasons = await fetchSeasonList().catch(() => [] as Array<Season>);
  const entries = await Promise.all(seasons.map(async (season): Promise<CareerEntry | undefined> => {
    const drivers = await driversService.getDriversInSeason(season).catch(() => [] as Array<Driver>);
    const found = drivers.find((d) => Number(d.id) === Number(driverId));
    return found ? { season, driver: found } : undefined;
  }));
  return entries
    .filter((e): e is CareerEntry => e !== undefined)
    .sort((a, b) => b.season.name.localeCompare(a.season.name, undefined, { numeric: true }));
}

watch(selectedSeasonId, (id) => selectSeason(id));

onMounted(async () => {
  try {
    driver.value = await driversService.getDriver(String(route.params.driver));
    thereIsDriver.value = true;
    career.value = await loadCareer(String(route.params.driver));
    if (career.value.length) {
      selectedSeasonId.value = career.value[0].season.id;
    }
  } catch (error: any) {
    thereIsDriver.value = false;
    notificationService.showNotification(error?.message, "error");
  } finally {
    isLoading.value = false;
  }
});

defineExpose({ driver, career, isLoading, thereIsDriver });
</script>
