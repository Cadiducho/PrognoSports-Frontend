import { barY, colorLegend, defineChart, group, lineY, text } from "@tanstack/charts";
import type { ChartPoint } from "@tanstack/charts";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import { gpPointScale } from "@/composables/charts/chartScales";
import { truncateLabel } from "@/composables/charts/chartText";
import { endLabelOffsets } from "@/composables/charts/endLabels";
import { HOME_CHART_HEIGHT, HOME_COLORS, LABEL_FONT_SIZE } from "@/composables/charts/homeStyle";
import type { CommunityPoint, SeriesPoint, SessionAverage } from "@/composables/charts/homeSeason";
import type { GrandPrix } from "@/types/GrandPrix";

const ME_LABEL = "Tú";
const COMMUNITY_LABEL = "Media";

/** Alto del gráfico de porcentaje de acierto y del de medias por sesión (px) */
export const HITS_CHART_HEIGHT = HOME_CHART_HEIGHT - 80;
export const SESSIONS_CHART_HEIGHT = 240;

interface HitsRow {
  gpCode: string;
  gpName: string;
  who: string;
  value: number | null;
}

export interface HomeHitsInput {
  grandPrixes: readonly GrandPrix[];
  me: readonly SeriesPoint[];
  community: readonly CommunityPoint[];
  compare?: { name: string; series: readonly SeriesPoint[] };
}

const percent = (value: number) => `${Math.round(value * 10) / 10}%`.replace(".", ",");

/** Porcentaje de acierto por Gran Premio: tú, la media de la comunidad y, si se elige, otro usuario */
export function buildHomeHitsChart({ grandPrixes, me, community, compare }: HomeHitsInput) {
  const compareLabel = compare ? truncateLabel(compare.name, 12) : null;

  const series = [
    {
      label: ME_LABEL,
      color: HOME_COLORS.me,
      width: 3.5,
      dash: undefined,
      rows: me.map((point): HitsRow => ({ gpCode: point.gpCode, gpName: point.gpName, who: ME_LABEL, value: point.hitPercentage })),
    },
    {
      label: COMMUNITY_LABEL,
      color: HOME_COLORS.average,
      width: 2,
      dash: "2 4",
      rows: community.map((point): HitsRow => ({ gpCode: point.gpCode, gpName: point.gpName, who: COMMUNITY_LABEL, value: point.averageHitPercentage })),
    },
    ...(compare && compareLabel ? [{
      label: compareLabel,
      color: HOME_COLORS.compare,
      width: 2.5,
      dash: undefined,
      rows: compare.series.map((point): HitsRow => ({ gpCode: point.gpCode, gpName: point.gpName, who: compareLabel, value: point.hitPercentage })),
    }] : []),
  ];

  const lastRows = series.flatMap((entry) => entry.rows.filter((row) => row.value !== null).slice(-1));

  const createChart = (offsets: ReadonlyMap<string, number>) => defineChart({
    marks: [
      ...series.flatMap((entry) => [
        lineY(entry.rows, {
          id: `${entry.label}-line`,
          x: "gpCode",
          y: (row) => row.value,
          z: () => entry.label,
          stroke: entry.color,
          strokeWidth: entry.width,
          strokeDasharray: entry.dash,
          points: entry.label !== COMMUNITY_LABEL,
        }),
      ]),
      text(lastRows, {
        id: "labels",
        key: (row) => row.who,
        x: "gpCode",
        y: (row) => row.value,
        text: (row) => row.who,
        fill: (row) => series.find((entry) => entry.label === row.who)?.color ?? "currentColor",
        anchor: "start",
        dx: 10,
        dy: (row) => offsets.get(row.who) ?? 0,
        fontSize: LABEL_FONT_SIZE + 1,
        fontWeight: 600,
      }),
    ],
    margin: { right: 96 },
    scales: {
      x: { scale: gpPointScale(grandPrixes), axis: { label: "Grandes Premios" } },
      y: {
        scale: scaleLinear().domain([0, 100]),
        grid: true,
        axis: { label: "% de acierto", ticks: { count: 5, format: (value: number) => `${value}%` } },
      },
    },
  });

  const offsets = endLabelOffsets(
    createChart(new Map()),
    lastRows.map((row) => ({ key: row.who, value: row.value! })),
    { height: HITS_CHART_HEIGHT, fontSize: LABEL_FONT_SIZE + 1 },
  );

  const gpNames = new Map(grandPrixes.map((gp) => [gp.code, gp.name]));
  const colorOf = new Map(series.map((entry) => [entry.label, entry.color]));

  return defineChart(createChart(offsets), {
    focus: "group-x",
    maxFocusDistance: Number.POSITIVE_INFINITY,
    tooltip: {
      use: tooltip,
      className: "p-chart-tooltip",
      content: (points: readonly ChartPoint[]) => {
        const byWho = new Map<string, HitsRow>();
        for (const point of points) {
          const row = point.datum as HitsRow;
          if (row.value !== null && !byWho.has(row.who)) {
            byWho.set(row.who, row);
          }
        }
        const gpCode = String(points[0]?.xValue ?? "");
        return {
          title: gpNames.get(gpCode) ?? gpCode,
          rows: [...byWho.values()]
            .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
            .map((row) => ({ label: row.who, value: percent(row.value!), color: colorOf.get(row.who) })),
        };
      },
    },
  });
}

interface SessionRow {
  sessionName: string;
  who: string;
  average: number;
}

export interface HomeSessionsInput {
  me: readonly SessionAverage[];
  community: readonly SessionAverage[];
  compare?: { name: string; averages: readonly SessionAverage[] };
}

/** Media de puntos por tipo de sesión: tú, la comunidad y, si se elige, otro usuario, en barras agrupadas */
export function buildHomeSessionsChart({ me, community, compare }: HomeSessionsInput) {
  const compareLabel = compare ? truncateLabel(compare.name, 12) : null;
  const toRows = (averages: readonly SessionAverage[], who: string): SessionRow[] => (
    averages.map((entry) => ({ sessionName: entry.sessionName, who, average: entry.average }))
  );

  const rows = [
    ...toRows(me, ME_LABEL),
    ...toRows(community, "Comunidad"),
    ...(compare && compareLabel ? toRows(compare.averages, compareLabel) : []),
  ];
  // La comunidad va primero, así que las sesiones salen en el mismo orden que en las barras apiladas de la pestaña de puntos
  const sessions = [...new Set(community.concat(me, compare?.averages ?? []).map((entry) => entry.sessionName))];
  const names = ["Comunidad", ME_LABEL, ...(compareLabel ? [compareLabel] : [])];

  return defineChart({
    marks: [
      barY(rows, {
        id: "session-averages",
        x: "sessionName",
        y: "average",
        color: "who",
        layout: group({ padding: 0.1 }),
        key: (row) => `${row.sessionName}-${row.who}`,
        inset: 1,
      }),
    ],
    scales: {
      x: { scale: () => scaleBand<string>().domain(sessions).padding(0.25) },
      y: { scale: scaleLinear, nice: true, grid: true, axis: { label: "Media de puntos" } },
    },
    color: {
      domain: names,
      range: [HOME_COLORS.average, HOME_COLORS.me, ...(compareLabel ? [HOME_COLORS.compare] : [])],
      legend: colorLegend({ placement: "bottom" }),
    },
    tooltip,
  });
}
