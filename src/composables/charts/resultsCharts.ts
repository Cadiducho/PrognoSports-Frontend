import { barY, colorLegend, defineChart, dot, group, lineY } from "@tanstack/charts";
import type { ChartPoint } from "@tanstack/charts";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import { gpNameByCode, gpPointScale, positionTicks } from "@/composables/charts/chartScales";
import type { StatLine } from "@/composables/useSeasonResults";
import type { GrandPrix } from "@/types/GrandPrix";

export type ResultSessionName = "RACE" | "QUALIFY" | "SPRINT_RACE";

/** Una línea de posiciones (p. ej. "Carrera" de un piloto, o "VER · Clasificación" en un equipo) */
export interface PositionSeries {
  key: string;
  label: string;
  color: string;
  /** Patrón de trazo discontinuo; sin él, línea sólida */
  dash?: string;
  session: ResultSessionName;
  /** Código del GP -> posición. Sin entrada o `null`: no hay resultado (no se dibuja punto) */
  values: ReadonlyMap<string, number | null>;
}

/** Alto de la gráfica de posiciones por GP (px) */
export const POSITIONS_CHART_HEIGHT = 360;
/** Alto de la gráfica de distribución de posiciones (px) */
export const DISTRIBUTION_CHART_HEIGHT = 280;
/** Alto del resumen de carrera por temporada (px) */
export const CAREER_CHART_HEIGHT = 320;

interface PositionRow {
  seriesKey: string;
  label: string;
  gpCode: string;
  position: number | null;
}

const validPosition = (position: number | null | undefined): number | null => (
  typeof position === "number" && position > 0 ? position : null
);

const formatPosition = (position: number): string => `P${position}`;

/** Peor posición registrada en cualquier serie, para que el eje no cambie al ocultar series */
function maxPositionOf(series: readonly PositionSeries[]): number {
  let max = 1;
  for (const line of series) {
    for (const value of line.values.values()) {
      const position = validPosition(value);
      if (position !== null && position > max) max = position;
    }
  }
  return max;
}

export interface PositionsChartInput {
  grandPrixes: readonly GrandPrix[];
  series: readonly PositionSeries[];
  visibleKeys: readonly string[];
}

/**
 * Posición en cada GP de la temporada, una línea por serie. El eje Y va invertido (P1 arriba) y
 * los GPs sin resultado (o abandonos sin posición) cortan la línea.
 */
export function buildPositionsChart({ grandPrixes, series, visibleKeys }: PositionsChartInput) {
  const visible = new Set(visibleKeys);
  const shown = series.filter((line) => visible.has(line.key));
  const maxPosition = maxPositionOf(series);

  const rowsOf = (line: PositionSeries): PositionRow[] => grandPrixes.map((gp) => ({
    seriesKey: line.key,
    label: line.label,
    gpCode: gp.code,
    position: validPosition(line.values.get(gp.code)),
  }));

  const marks = shown.flatMap((line) => {
    const rows = rowsOf(line);
    return [
      lineY(rows, {
        id: `${line.key}-line`,
        x: "gpCode",
        y: (row) => row.position,
        z: () => line.key,
        key: (row) => `${row.seriesKey}-${row.gpCode}`,
        stroke: line.color,
        strokeWidth: line.session === "RACE" ? 3 : 2,
        strokeDasharray: line.dash,
      }),
      dot(rows.filter((row) => row.position !== null), {
        id: `${line.key}-dots`,
        x: "gpCode",
        y: (row) => row.position,
        key: (row) => `${row.seriesKey}-${row.gpCode}`,
        fill: line.color,
        r: line.session === "RACE" ? 5 : 4,
      }),
    ];
  });

  const gpNames = gpNameByCode(grandPrixes);
  const colorOf = new Map(series.map((line) => [line.key, line.color]));

  return defineChart({
    marks,
    scales: {
      x: { scale: gpPointScale(grandPrixes), axis: { label: "Grandes Premios" } },
      y: {
        // Medio puesto de holgura para que el 1º y el último no queden pegados a los bordes
        scale: scaleLinear().domain([0.5, maxPosition + 0.5]),
        reverse: true,
        grid: true,
        axis: { label: "Posición", ticks: { values: positionTicks(maxPosition), format: formatPosition } },
      },
    },
    focus: "group-x",
    maxFocusDistance: Number.POSITIVE_INFINITY,
    tooltip: {
      use: tooltip,
      className: "p-chart-tooltip",
      anchor: "group-center",
      placement: ["top", "right", "left", "bottom"],
      content: (points: readonly ChartPoint[]) => {
        // La línea y el punto de cada serie emiten el mismo punto: una fila por serie
        const bySeries = new Map<string, PositionRow>();
        for (const point of points) {
          const row = point.datum as PositionRow;
          if (row.position !== null && !bySeries.has(row.seriesKey)) {
            bySeries.set(row.seriesKey, row);
          }
        }
        const gpCode = String(points[0]?.xValue ?? "");
        // Se respeta el orden de las series (carrera, clasificación...)
        const rows = shown.flatMap((line) => {
          const row = bySeries.get(line.key);
          return row && row.position !== null
            ? [{ label: line.label, value: formatPosition(row.position), color: colorOf.get(line.key) }]
            : [];
        });
        return { title: gpNames.get(gpCode) ?? gpCode, rows };
      },
    },
  });
}

interface DistributionRow {
  position: string;
  label: string;
  count: number;
}

export interface DistributionChartInput {
  /** Solo se cuentan las series de carrera */
  series: readonly PositionSeries[];
  visibleKeys: readonly string[];
}

/** Series de carrera visibles, que son las que cuenta la distribución */
export function distributionSeries(series: readonly PositionSeries[], visibleKeys: readonly string[]): PositionSeries[] {
  const visible = new Set(visibleKeys);
  return series.filter((line) => line.session === "RACE" && visible.has(line.key));
}

/** Cuántas veces acabó en cada posición en carrera; en un equipo, apilado por piloto */
export function buildPositionDistributionChart({ series, visibleKeys }: DistributionChartInput) {
  const raceSeries = series.filter((line) => line.session === "RACE");
  const shown = distributionSeries(series, visibleKeys);
  const maxPosition = maxPositionOf(raceSeries);
  const positions = Array.from({ length: maxPosition }, (_, index) => formatPosition(index + 1));

  const rows: DistributionRow[] = shown.flatMap((line) => {
    const counts = new Map<number, number>();
    for (const value of line.values.values()) {
      const position = validPosition(value);
      if (position !== null) counts.set(position, (counts.get(position) ?? 0) + 1);
    }
    return [...counts.entries()].map(([position, count]) => ({ position: formatPosition(position), label: line.label, count }));
  });

  return defineChart({
    marks: [
      barY(rows, {
        id: "distribution",
        x: "position",
        y: "count",
        color: "label",
        key: (row) => `${row.position}-${row.label}`,
        inset: 2,
      }),
    ],
    scales: {
      x: { scale: () => scaleBand<string>().domain(positions).padding(0.15), axis: { label: "Posición final" } },
      y: {
        scale: scaleLinear,
        nice: true,
        grid: true,
        axis: { label: "Veces", ticks: { format: (value: number) => (Number.isInteger(value) ? String(value) : "") } },
      },
    },
    // Dominio con todas las series de carrera para que cada una conserve su color al ocultar otras
    color: {
      domain: raceSeries.map((line) => line.label),
      range: raceSeries.map((line) => line.color),
      ...(raceSeries.length > 1 ? { legend: colorLegend({ placement: "bottom" }) } : {}),
    },
    focus: "group-x",
    maxFocusDistance: Number.POSITIVE_INFINITY,
    tooltip: {
      use: tooltip,
      className: "p-chart-tooltip",
      content: (points: readonly ChartPoint[]) => {
        const position = String(points[0]?.xValue ?? "");
        const atPosition = rows.filter((row) => row.position === position);
        const total = atPosition.reduce((sum, row) => sum + row.count, 0);
        return {
          title: position,
          rows: [
            ...(atPosition.length > 1
              ? atPosition.map((row) => ({
                label: row.label,
                value: String(row.count),
                color: raceSeries.find((line) => line.label === row.label)?.color,
              }))
              : []),
            { label: total === 1 ? "Vez" : "Veces", value: String(total) },
          ],
        };
      },
    },
  });
}

export interface CareerSeason {
  name: string;
  stats: StatLine;
}

const CAREER_METRICS: ReadonlyArray<{ label: string; color: string; value: (stats: StatLine) => number }> = [
  { label: "Victorias", color: "#f59e0b", value: (stats) => stats.wins },
  { label: "Podios", color: "#8b5cf6", value: (stats) => stats.podiums },
  { label: "Poles", color: "#0ea5e9", value: (stats) => stats.poles },
  { label: "Victorias sprint", color: "#22c55e", value: (stats) => stats.sprintWins },
];

interface CareerRow {
  season: string;
  metric: string;
  value: number;
}

/** Victorias, podios, poles y victorias al sprint de cada temporada, en barras agrupadas */
export function buildCareerSummaryChart(seasons: readonly CareerSeason[]) {
  // Las victorias al sprint solo se muestran si alguna temporada tiene alguna
  const metrics = CAREER_METRICS.filter((metric) => metric.label !== "Victorias sprint"
    || seasons.some((season) => season.stats.sprintWins > 0));

  const rows: CareerRow[] = seasons.flatMap((season) => metrics.map((metric) => ({
    season: season.name,
    metric: metric.label,
    value: metric.value(season.stats),
  })));

  return defineChart({
    marks: [
      barY(rows, {
        id: "career",
        x: "season",
        y: "value",
        color: "metric",
        layout: group({ padding: 0.1 }),
        key: (row) => `${row.season}-${row.metric}`,
        inset: 1,
      }),
    ],
    scales: {
      x: { scale: () => scaleBand<string>().domain(seasons.map((season) => season.name)).padding(0.25), axis: { label: "Temporada" } },
      y: {
        scale: scaleLinear,
        nice: true,
        grid: true,
        axis: { ticks: { format: (value: number) => (Number.isInteger(value) ? String(value) : "") } },
      },
    },
    color: {
      domain: metrics.map((metric) => metric.label),
      range: metrics.map((metric) => metric.color),
      legend: colorLegend({ placement: "bottom" }),
    },
    focus: "group-x",
    maxFocusDistance: Number.POSITIVE_INFINITY,
    tooltip: {
      use: tooltip,
      className: "p-chart-tooltip",
      content: (points: readonly ChartPoint[]) => {
        const season = String(points[0]?.xValue ?? "");
        return {
          title: season,
          rows: metrics.map((metric) => ({
            label: metric.label,
            value: String(rows.find((row) => row.season === season && row.metric === metric.label)?.value ?? 0),
            color: metric.color,
          })),
        };
      },
    },
  });
}
