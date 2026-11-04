<script setup lang="ts">
import { computed } from "vue";
import type { SeriesPoint } from "@/composables/charts/homeSeason";
import { headToHead } from "@/composables/charts/homeStats";
import { buildHomeHeadToHeadChart, HEAD_TO_HEAD_CHART_HEIGHT } from "@/composables/charts/homeHeadToHeadChart";
import { formatDelta } from "@/composables/charts/accumulatedView";
import type { GrandPrix } from "@/types/GrandPrix";
import PChart from "@/components/lib/charts/PChart.vue";
import StatTile from "@/components/stats/StatTile.vue";

const props = withDefaults(defineProps<{
  grandPrixes: readonly GrandPrix[];
  me: readonly SeriesPoint[];
  /** null si no se ha elegido a nadie con quien compararse */
  rival: { name: string; series: readonly SeriesPoint[] } | null;
  /** false al ver el perfil de otro usuario: el texto pasa a tercera persona */
  own?: boolean;
  /** Usuario de la serie principal; necesario para los textos en tercera persona */
  username?: string;
}>(), {
  own: true,
  username: undefined,
});

const name = computed(() => (props.own ? undefined : props.username));

const duel = computed(() => (props.rival ? headToHead(props.me, props.rival.series) : null));
const compared = computed(() => (duel.value ? duel.value.wins + duel.value.losses + duel.value.ties : 0));

const chart = computed(() => (props.rival && duel.value
  ? buildHomeHeadToHeadChart({ grandPrixes: props.grandPrixes, rivalName: props.rival.name, rows: duel.value.rows, meLabel: name.value })
  : null));

const tiles = computed(() => {
  const data = duel.value;
  if (!data || !props.rival) {
    return [];
  }
  const diff = data.accumulatedDiff;
  const ahead = name.value ? `${name.value} va por delante de ${props.rival.name}` : `Vas por delante de ${props.rival.name}`;
  return [
    { label: "GPs ganados", value: `${data.wins} de ${compared.value}`, hint: data.ties > 0 ? `${data.losses} perdidos · ${data.ties} empatados` : `${data.losses} perdidos` },
    {
      label: "Diferencia acumulada",
      value: diff === null ? "—" : `${formatDelta(diff)} pts`,
      hint: diff === null ? undefined : diff > 0 ? ahead : diff < 0 ? `${props.rival.name} va por delante` : name.value ? "Están empatados" : "Estáis empatados",
    },
    { label: name.value ? "Su mayor victoria" : "Tu mayor victoria", value: data.biggestWin ? `+${data.biggestWin.value} pts` : "—", hint: data.biggestWin?.gpName },
    { label: name.value ? "Su mayor derrota" : "Tu mayor derrota", value: data.biggestLoss ? `−${data.biggestLoss.value} pts` : "—", hint: data.biggestLoss?.gpName },
  ];
});
</script>

<template>
  <p
    v-if="!rival"
    class="text-center text-sm text-gray-600 dark:text-gray-400"
  >
    Elige a alguien en «Comparar con» para ver el cara a cara
  </p>
  <p
    v-else-if="compared === 0"
    class="text-center text-sm text-gray-600 dark:text-gray-400"
  >
    <template v-if="name">
      {{ name }} y {{ rival.name }} todavía no han puntuado en los mismos Grandes Premios
    </template>
    <template v-else>
      Tú y {{ rival.name }} todavía no habéis puntuado en los mismos Grandes Premios
    </template>
  </p>
  <div
    v-else-if="duel && chart"
    class="flex flex-col gap-4"
  >
    <PChart
      :definition="chart"
      :aria-label="`Diferencia de puntos entre ${name ?? 'ti'} y ${rival.name} en cada Gran Premio`"
      :height="HEAD_TO_HEAD_CHART_HEIGHT"
    />

    <ul class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
      <StatTile
        v-for="tile in tiles"
        :key="tile.label"
        v-bind="tile"
      />
    </ul>

    <section
      v-if="duel.bySession.length"
      aria-labelledby="home-duel-sessions-title"
    >
      <h3
        id="home-duel-sessions-title"
        class="mb-2 text-base font-semibold text-gray-900 dark:text-gray-100"
      >
        Quién gana en cada sesión
      </h3>
      <ul class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          v-for="session in duel.bySession"
          :key="session.sessionId"
          :label="session.sessionName"
          :value="`${session.wins} - ${session.losses}`"
          :hint="session.wins === session.losses ? 'Empate' : session.wins > session.losses ? `Ventaja para ${name ?? 'ti'}` : `Ventaja para ${rival.name}`"
        />
      </ul>
    </section>
  </div>
</template>
