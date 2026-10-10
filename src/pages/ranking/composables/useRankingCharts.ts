import { computed, type Ref } from "vue";
import { GrandPrix } from "@/types/GrandPrix";
import { RankingHitsCell, RankingLinePoint } from "@/pages/ranking/types/ranking";
import type { ChartLegendItem } from "@/components/lib/charts/types";
import { userColorOptions } from "@/composables/charts/chartScales";
import { type AccumulatedMode, formatDelta, toAccumulatedView } from "@/composables/charts/accumulatedView";
import { buildUserLinesChart } from "@/composables/charts/userLinesChart";
import { buildHitsHeatmapChart, hitsHeatmapHeight } from "@/composables/charts/hitsHeatmapChart";

interface RankingChartsParams {
  grandPrixes: Ref<GrandPrix[]>;
  rankedUsernames: Ref<string[]>;
  /** Usuarios visibles en las gráficas de líneas. Lo comparten las pestañas y la leyenda. */
  visibleUsers: Ref<string[]>;
  /** Cómo se dibujan los puntos acumulados: diferencia con el líder, contigo o el total */
  accumulatedMode: Ref<AccumulatedMode>;
  currentUsername: string;
  gpPointsData: Ref<RankingLinePoint[]>;
  accumulatedPointsData: Ref<RankingLinePoint[]>;
  standingsData: Ref<RankingLinePoint[]>;
  hitsCells: Ref<RankingHitsCell[]>;
}

const ACCUMULATED_Y_LABEL: Record<AccumulatedMode, string> = {
  leader: "Puntos respecto al líder",
  me: "Puntos respecto a ti",
  total: "Puntos acumulados",
};

export function useRankingCharts(params: RankingChartsParams) {
  const lineOptions = (rows: readonly RankingLinePoint[]) => ({
    rows,
    grandPrixes: params.grandPrixes.value,
    rankedUsernames: params.rankedUsernames.value,
    visibleUsers: params.visibleUsers.value,
    currentUsername: params.currentUsername,
  });

  // Una pill por usuario, con el mismo color que su línea
  const legendItems = computed<ChartLegendItem[]>(() => {
    const { domain, range } = userColorOptions(params.rankedUsernames.value);
    return domain.map((username, index) => ({ key: username, label: username, color: range[index]! }));
  });

  // Comparar contigo solo tiene sentido si apareces en el ranking
  const canCompareWithMe = computed(() => params.rankedUsernames.value.includes(params.currentUsername));

  const gpPointsChart = computed(() => buildUserLinesChart({
    ...lineOptions(params.gpPointsData.value),
    yLabel: "Puntos",
  }));

  // El acumulado solo sube y apelotona las líneas: por defecto se dibuja la diferencia con el líder o contigo
  const accumulatedPointsChart = computed(() => {
    const mode = params.accumulatedMode.value;
    const isDifference = mode !== "total";
    const rows = toAccumulatedView(params.accumulatedPointsData.value, mode, params.currentUsername);

    return buildUserLinesChart({
      ...lineOptions(rows),
      yLabel: ACCUMULATED_Y_LABEL[mode],
      formatValue: isDifference ? formatDelta : undefined,
      formatTick: isDifference ? formatDelta : undefined,
      referenceLine: isDifference ? { label: mode === "leader" ? "Líder" : "Tú" } : undefined,
      endLabels: isDifference,
    });
  });

  const standingsChart = computed(() => buildUserLinesChart({
    ...lineOptions(params.standingsData.value),
    yLabel: "Posición",
    standings: true,
  }));

  const hitsHeatmapChart = computed(() => buildHitsHeatmapChart({
    cells: params.hitsCells.value,
    grandPrixes: params.grandPrixes.value,
    rankedUsernames: params.rankedUsernames.value,
  }));
  const hitsHeatmapChartHeight = computed(() => hitsHeatmapHeight(params.rankedUsernames.value.length));

  return {
    legendItems,
    canCompareWithMe,
    gpPointsChart,
    accumulatedPointsChart,
    standingsChart,
    hitsHeatmapChart,
    hitsHeatmapChartHeight,
  };
}
