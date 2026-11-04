<script setup lang="ts">
import { computed } from "vue";
import type { FormStats } from "@/composables/charts/homeSeason";
import type { SeasonRecords } from "@/composables/charts/homeStats";
import HomeFormStats from "@/components/home/HomeFormStats.vue";
import HomeStatTile from "@/components/home/HomeStatTile.vue";

const props = defineProps<{
  records: SeasonRecords;
  form: FormStats | null;
  /** false al ver el perfil de otro usuario: el texto pasa a tercera persona */
  own?: boolean;
}>();

const third = computed(() => props.own === false);

const decimal = (value: number) => value.toLocaleString("es-ES", { maximumFractionDigits: 1 });
const gps = (count: number) => `${count} ${count === 1 ? "GP" : "GPs"}`;

const moments = computed(() => {
  const { bestGp, worstGp, bestPosition, consistency, averagePercentile } = props.records;
  return [
    { label: "Mejor GP", value: bestGp ? `${decimal(bestGp.value)} pts` : "—", hint: bestGp?.gpName },
    { label: "Peor GP", value: worstGp ? `${decimal(worstGp.value)} pts` : "—", hint: worstGp?.gpName },
    { label: "Mejor puesto", value: bestPosition ? `${bestPosition.standings}º` : "—", hint: bestPosition?.gpName },
    {
      label: "Regularidad",
      value: consistency === null ? "—" : `± ${decimal(consistency)} pts`,
      hint: `Desviación típica de ${third.value ? "sus" : "tus"} puntos por GP: cuanto menos, más regular`,
    },
    {
      label: "Frente a la comunidad",
      value: averagePercentile === null ? "—" : `${averagePercentile} %`,
      hint: `De media, a ese porcentaje de la comunidad ${third.value ? "supera" : "superas"} en cada GP`,
    },
  ];
});

const achievements = computed(() => {
  const { streaks, gpsAsLeader } = props.records;
  return [
    { label: "Sobre la media", value: gps(streaks.aboveAverage.current), hint: `Racha actual · mejor: ${gps(streaks.aboveAverage.best)}` },
    { label: "En el podio del GP", value: gps(streaks.podium.current), hint: `Racha actual · mejor: ${gps(streaks.podium.best)}` },
    { label: "Subiendo puestos", value: gps(streaks.climbing.current), hint: `Racha actual · mejor: ${gps(streaks.climbing.best)}` },
    { label: "Líder de la general", value: gps(gpsAsLeader), hint: "GPs terminados en el primer puesto" },
  ];
});
</script>

<template>
  <p
    v-if="records.played === 0"
    class="text-center text-sm text-gray-600 dark:text-gray-400"
  >
    Aún no hay datos para calcular {{ third ? "sus" : "tus" }} récords
  </p>
  <div
    v-else
    class="flex flex-col gap-5"
  >
    <HomeFormStats
      :form="form"
      :own="own"
    />

    <section aria-labelledby="home-moments-title">
      <h3
        id="home-moments-title"
        class="mb-2 text-base font-semibold text-gray-900 dark:text-gray-100"
      >
        Mejores y peores momentos
      </h3>
      <ul class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <HomeStatTile
          v-for="tile in moments"
          :key="tile.label"
          v-bind="tile"
        />
      </ul>
    </section>

    <section aria-labelledby="home-achievements-title">
      <h3
        id="home-achievements-title"
        class="mb-2 text-base font-semibold text-gray-900 dark:text-gray-100"
      >
        Rachas y logros
      </h3>
      <ul class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <HomeStatTile
          v-for="tile in achievements"
          :key="tile.label"
          v-bind="tile"
        />
      </ul>
    </section>
  </div>
</template>
