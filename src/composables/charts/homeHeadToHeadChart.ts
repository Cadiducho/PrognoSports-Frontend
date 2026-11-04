import { barY, colorLegend, defineChart, ruleY } from "@tanstack/charts";
import type { ChartPoint } from "@tanstack/charts";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import { gpBandScale } from "@/composables/charts/chartScales";
import { truncateLabel } from "@/composables/charts/chartText";
import { formatDelta } from "@/composables/charts/accumulatedView";
import { HOME_COLORS } from "@/composables/charts/homeStyle";
import type { HeadToHeadRow } from "@/composables/charts/homeStats";
import type { GrandPrix } from "@/types/GrandPrix";

const DEFAULT_ME_LABEL = "Tú";

/** Alto del gráfico de cara a cara (px) */
export const HEAD_TO_HEAD_CHART_HEIGHT = 320;

interface BarRow {
  gpCode: string;
  gpName: string;
  /** Quién gana el GP */
  winner: string;
  /** Diferencia de puntos en valor absoluto, con el signo de quien gana: arriba tú, abajo el rival */
  value: number;
}

export interface HomeHeadToHeadInput {
  /** Etiqueta de la serie principal; por defecto "Tú" (en el perfil de otro usuario, su nombre) */
  meLabel?: string;
  grandPrixes: readonly GrandPrix[];
  rivalName: string;
  rows: readonly HeadToHeadRow[];
}

/**
 * Barras divergentes por GP: hacia arriba los puntos de ventaja que sacas al rival y hacia abajo los que te saca él.
 * Los GPs empatados o sin datos de alguno de los dos no dibujan barra.
 */
export function buildHomeHeadToHeadChart({ grandPrixes, rivalName, rows, meLabel }: HomeHeadToHeadInput) {
  const ME_LABEL = truncateLabel(meLabel ?? DEFAULT_ME_LABEL, 14);
  const rivalLabel = truncateLabel(rivalName, 14);
  const winsLabel = meLabel ? `${ME_LABEL} gana a ${rivalLabel}` : `Ganas a ${rivalLabel}`;
  const losesLabel = meLabel ? `${rivalLabel} gana a ${ME_LABEL}` : `${rivalLabel} te gana`;

  const bars: BarRow[] = rows.flatMap((row) => (
    row.diff === null || row.diff === 0
      ? []
      : [{ gpCode: row.gpCode, gpName: row.gpName, winner: row.diff > 0 ? ME_LABEL : rivalLabel, value: row.diff }]
  ));

  const chart = defineChart({
    marks: [
      barY(bars, {
        id: "difference",
        x: "gpCode",
        y: "value",
        color: "winner",
        key: (row) => row.gpCode,
        inset: 2,
      }),
      ruleY([0], { id: "reference", strokeOpacity: 0.6 }),
    ],
    scales: {
      x: { scale: gpBandScale(grandPrixes), axis: { label: "Grandes Premios" } },
      y: { scale: scaleLinear, nice: true, grid: true, axis: { label: "Diferencia de puntos" } },
    },
    color: {
      domain: [ME_LABEL, rivalLabel],
      range: [HOME_COLORS.me, HOME_COLORS.compare],
      legend: colorLegend({ placement: "bottom" }),
    },
  });

  const gpNames = new Map(grandPrixes.map((gp) => [gp.code, gp.name]));

  return defineChart(chart, {
    focus: "group-x",
    maxFocusDistance: Number.POSITIVE_INFINITY,
    tooltip: {
      use: tooltip,
      className: "p-chart-tooltip",
      content: (points: readonly ChartPoint[]) => {
        const gpCode = String(points[0]?.xValue ?? "");
        const row = points.map((point) => point.datum as BarRow).find((datum) => datum.gpCode === gpCode);
        return {
          title: gpNames.get(gpCode) ?? gpCode,
          rows: row
            ? [{
              label: row.winner === ME_LABEL ? winsLabel : losesLabel,
              value: `${formatDelta(Math.abs(row.value))} pts`,
              color: row.winner === ME_LABEL ? HOME_COLORS.me : HOME_COLORS.compare,
            }]
            : [],
        };
      },
    },
  });
}
