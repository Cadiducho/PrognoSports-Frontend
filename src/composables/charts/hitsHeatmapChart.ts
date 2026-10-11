import { cell, colorLegend, defineChart, text } from "@tanstack/charts";
import type { ChartPoint } from "@tanstack/charts";
import { scaleBand } from "@tanstack/charts/scales/band";
import { tooltip } from "@tanstack/charts/tooltip";
import { truncateLabel } from "@/composables/charts/chartText";
import type { GrandPrix } from "@/types/GrandPrix";
import type { HitsLevel, RankingHitsCell } from "@/pages/ranking/types/ranking";

const LEVELS: Record<HitsLevel, { label: string; color: string }> = {
  none: { label: "No participó", color: "rgb(156 163 175 / 0.15)" },
  zero: { label: "0 aciertos", color: "#808080" },
  low: { label: "Bajo", color: "#ff9f6b" },
  mid: { label: "Medio", color: "#efd800" },
  high: { label: "Alto", color: "#44d63c" },
  max: { label: "Máximo", color: "#ae29d0" },
};

const LEVEL_ORDER: HitsLevel[] = ["none", "zero", "low", "mid", "high", "max"];

/** Alto en px de cada fila de usuario, más los ejes y la leyenda */
export function hitsHeatmapHeight(userCount: number): number {
  return Math.max(220, userCount * 28 + 130);
}

export interface HitsHeatmapOptions {
  cells: readonly RankingHitsCell[];
  grandPrixes: readonly GrandPrix[];
  /** Usuarios de mejor a peor clasificado (de arriba abajo) */
  rankedUsernames: readonly string[];
}

export function buildHitsHeatmapChart({ cells, grandPrixes, rankedUsernames }: HitsHeatmapOptions) {
  const gpNames = new Map(grandPrixes.map((gp) => [gp.code, gp.name]));
  const levelLabel = (row: RankingHitsCell) => LEVELS[row.level].label;

  return defineChart({
    marks: [
      cell(cells, {
        id: "hits",
        x: "gpCode",
        y: "username",
        color: levelLabel,
        key: (row) => `${row.username}-${row.gpCode}`,
        inset: 1,
      }),
      text(cells.filter((row) => row.participated), {
        id: "hits-labels",
        x: "gpCode",
        y: "username",
        text: (row) => row.hits,
        fill: "#111827",
        fontWeight: 600,
      }),
    ],
    scales: {
      x: {
        scale: () => scaleBand<string>().domain(grandPrixes.map((gp) => gp.code)).padding(0.04),
        axis: { label: "Grandes Premios" },
      },
      y: {
        scale: () => scaleBand<string>().domain([...rankedUsernames]).padding(0.04),
        axis: { label: "Usuarios", ticks: { format: (username) => truncateLabel(username) } },
      },
    },
    color: {
      domain: LEVEL_ORDER.map((level) => LEVELS[level].label),
      range: LEVEL_ORDER.map((level) => LEVELS[level].color),
      legend: colorLegend({ label: "Aciertos respecto al máximo del GP", placement: "bottom" }),
    },
    tooltip: {
      use: tooltip,
      className: "p-chart-tooltip",
      content: (points: readonly ChartPoint[]) => {
        const row = points[0]?.datum as RankingHitsCell | undefined;
        if (!row) {
          return { rows: [] };
        }
        return {
          title: `${row.username} · ${gpNames.get(row.gpCode) ?? row.gpCode}`,
          rows: [{
            label: "Aciertos",
            value: row.participated ? `${row.hits} de ${row.maxHits}` : "No participó",
            color: LEVELS[row.level].color,
          }],
        };
      },
    },
  });
}
