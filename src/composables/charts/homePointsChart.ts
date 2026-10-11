import { areaY, barY, colorLegend, colorLegendItems, defineChart, lineY, text } from "@tanstack/charts";
import type { ChartPoint } from "@tanstack/charts";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import { alignX, composeViews, grid } from "@tanstack/charts/view";
import { gpBandScale } from "@/composables/charts/chartScales";
import { truncateLabel } from "@/composables/charts/chartText";
import { endLabelOffsets } from "@/composables/charts/endLabels";
import {
  BONUS_COLOR,
  BONUS_LABEL,
  BOTTOM_PANEL_GROW,
  HOME_CHART_HEIGHT,
  HOME_COLORS,
  LABEL_FONT_SIZE,
  PANEL_GAP,
  SESSION_COLORS,
  TOP_PANEL_GROW,
} from "@/composables/charts/homeStyle";
import { type CommunityPoint, SESSION_ORDER, type SeriesPoint, sessionName } from "@/composables/charts/homeSeason";
import type { GrandPrix } from "@/types/GrandPrix";

const ME_LABEL = "Tú";
const LEADER_LABEL = "Líder";
const AVERAGE_LABEL = "Media";

/** Una fila por Gran Premio del panel de acumulado */
interface TopRow {
  gpCode: string;
  gpName: string;
  me: number | null;
  leader: number | null;
  average: number | null;
  compare: number | null;
}

/** Un tramo de la barra apilada de un GP: una sesión o el bonus */
interface SegmentRow {
  gpCode: string;
  gpName: string;
  segment: string;
  points: number;
}

interface TrophyRow {
  gpCode: string;
  total: number;
}

export interface HomePointsInput {
  /** Grandes Premios que se dibujan (ya recortados por la ventana) */
  grandPrixes: readonly GrandPrix[];
  username: string;
  me: readonly SeriesPoint[];
  community: readonly CommunityPoint[];
  winners: ReadonlyMap<string, readonly string[]>;
  /** Usuario con el que comparar, si se ha elegido */
  compare?: { name: string; series: readonly SeriesPoint[] };
}

// Hueco a la derecha de ambos paneles para los rótulos del final de cada línea
const RIGHT_MARGIN = 88;

/** Último GP en el que la serie tiene valor, para rotular el final de su línea */
function lastRow(rows: readonly TopRow[], pick: (row: TopRow) => number | null): TopRow[] {
  const last = [...rows].reverse().find((row) => pick(row) !== null);
  return last ? [last] : [];
}

/** Los puntos de un GP desglosados por sesión; lo que no explican las sesiones se muestra como bonus */
function segmentsOf(point: SeriesPoint): SegmentRow[] {
  if (point.pointsInGP === null) {
    return [];
  }
  const base = { gpCode: point.gpCode, gpName: point.gpName };
  const bySession = SESSION_ORDER.flatMap((sessionId) => {
    const points = point.pointsBySession[sessionId];
    return typeof points === "number" && points !== 0 ? [{ ...base, segment: sessionName(sessionId), points }] : [];
  });
  const explained = bySession.reduce((sum, segment) => sum + segment.points, 0);
  const rest = point.pointsInGP - explained;
  return rest > 0 ? [...bySession, { ...base, segment: BONUS_LABEL, points: rest }] : bySession;
}

/**
 * Dos paneles con el mismo eje de Grandes Premios: arriba tu acumulado frente al líder, la media de tu comunidad y,
 * si se elige, otro usuario; abajo los puntos de cada GP apilados por sesión, con 🏆 en los GPs que ganaste.
 * Van separados porque sus magnitudes (cientos frente a decenas) aplastarían una serie.
 */
export function buildHomePointsChart(input: HomePointsInput) {
  const { grandPrixes, username, me, community, winners, compare } = input;
  const compareLabel = compare ? truncateLabel(compare.name, 12) : null;

  const topRows: TopRow[] = grandPrixes.map((gp, index) => ({
    gpCode: gp.code,
    gpName: gp.name,
    me: me[index]?.accumulated ?? null,
    leader: community[index]?.leader ?? null,
    average: community[index]?.averageAccumulated ?? null,
    compare: compare?.series[index]?.accumulated ?? null,
  }));

  const segmentRows = me.flatMap(segmentsOf);
  const trophyRows: TrophyRow[] = me.flatMap((point) => (
    point.pointsInGP !== null && point.pointsInGP > 0 && winners.get(point.gpCode)?.includes(username)
      ? [{ gpCode: point.gpCode, total: point.pointsInGP }]
      : []
  ));

  const seriesLabel = (label: string, pick: (row: TopRow) => number | null, color: string, dash: string | undefined, offsets: ReadonlyMap<string, number>, weight = 600) => [
    lineY(topRows, {
      id: `${label}-line`,
      x: "gpCode",
      y: pick,
      z: () => label,
      stroke: color,
      strokeWidth: 2,
      strokeDasharray: dash,
    }),
    text(lastRow(topRows, pick), {
      id: `${label}-label`,
      x: "gpCode",
      y: pick,
      text: () => label,
      fill: color,
      anchor: "start",
      dx: 8,
      dy: offsets.get(label) ?? 0,
      fontSize: LABEL_FONT_SIZE,
      fontWeight: weight,
    }),
  ];

  // Los rótulos del final de cada línea se separan si chocan: primero se mide sin desplazamientos y luego se aplican
  const createTopView = (offsets: ReadonlyMap<string, number>) => defineChart({
    marks: [
      areaY(topRows, {
        id: "me-area",
        x: "gpCode",
        y: (row) => row.me,
        z: () => ME_LABEL,
        fill: HOME_COLORS.me,
        fillOpacity: 0.15,
      }),
      ...seriesLabel(AVERAGE_LABEL, (row) => row.average, HOME_COLORS.average, "2 4", offsets),
      ...seriesLabel(LEADER_LABEL, (row) => row.leader, HOME_COLORS.leader, "7 5", offsets),
      ...(compareLabel ? seriesLabel(compareLabel, (row) => row.compare, HOME_COLORS.compare, undefined, offsets) : []),
      lineY(topRows, {
        id: "me-line",
        x: "gpCode",
        y: (row) => row.me,
        z: () => ME_LABEL,
        stroke: HOME_COLORS.me,
        strokeWidth: 3,
        points: true,
      }),
      text(lastRow(topRows, (row) => row.me), {
        id: "me-label",
        x: "gpCode",
        y: (row) => row.me,
        text: () => ME_LABEL,
        fill: HOME_COLORS.me,
        anchor: "start",
        dx: 8,
        dy: offsets.get(ME_LABEL) ?? 0,
        fontSize: LABEL_FONT_SIZE,
        fontWeight: 700,
      }),
    ],
    margin: { right: RIGHT_MARGIN },
    scales: {
      x: { scale: gpBandScale(grandPrixes), axis: false },
      y: { scale: scaleLinear, nice: true, grid: true, axis: { label: "Puntos acumulados" } },
    },
  });

  // Alto del panel superior según el reparto de la rejilla
  const topPanelHeight = Math.round(((HOME_CHART_HEIGHT - PANEL_GAP) * TOP_PANEL_GROW) / (TOP_PANEL_GROW + BOTTOM_PANEL_GROW));
  const anchors = [
    { key: ME_LABEL, pick: (row: TopRow) => row.me },
    { key: LEADER_LABEL, pick: (row: TopRow) => row.leader },
    { key: AVERAGE_LABEL, pick: (row: TopRow) => row.average },
    ...(compareLabel ? [{ key: compareLabel, pick: (row: TopRow) => row.compare }] : []),
  ].flatMap(({ key, pick }) => lastRow(topRows, pick).map((row) => ({ key, value: pick(row)! })));
  const offsets = endLabelOffsets(createTopView(new Map()), anchors, { height: topPanelHeight, fontSize: LABEL_FONT_SIZE });
  const topView = createTopView(offsets);

  const segmentNames = [...SESSION_ORDER.map(sessionName), BONUS_LABEL];
  const segmentColors = [...SESSION_ORDER.map((id) => SESSION_COLORS[id]!), BONUS_COLOR];

  const pointsView = defineChart({
    marks: [
      barY(segmentRows, {
        id: "points",
        x: "gpCode",
        y: "points",
        color: "segment",
        key: (row) => `${row.gpCode}-${row.segment}`,
        inset: 2,
      }),
      text(trophyRows, {
        id: "trophies",
        x: "gpCode",
        y: "total",
        text: () => "🏆",
        dy: -9,
        fontSize: 14,
      }),
    ],
    margin: { right: RIGHT_MARGIN },
    scales: {
      x: { scale: gpBandScale(grandPrixes), axis: { label: "Grandes Premios" } },
      y: { scale: scaleLinear, nice: true, grid: true, axis: { label: "Por GP" } },
    },
    color: {
      domain: segmentNames,
      range: segmentColors,
      // Leyenda compacta, centrada y sin columnas de igual ancho, para que quepa en una sola fila
      legend: colorLegend({ placement: "bottom", items: colorLegendItems({ justify: "center", gap: 16, rowGap: 4 }) }),
    },
  });

  const composed = composeViews({
    views: { accumulated: topView, points: pointsView },
    layout: grid({
      rows: [
        { id: "accumulated", grow: TOP_PANEL_GROW },
        { id: "points", grow: BOTTOM_PANEL_GROW },
      ],
      columns: [{ id: "main", grow: 1 }],
      gap: PANEL_GAP,
      cells: {
        accumulated: { row: "accumulated", column: "main" },
        points: { row: "points", column: "main" },
      },
    }),
    links: [alignX("accumulated", "points")],
  });

  const gpNames = new Map(grandPrixes.map((gp) => [gp.code, gp.name]));
  const colorOf = new Map<string, string>([
    [ME_LABEL, HOME_COLORS.me],
    [LEADER_LABEL, HOME_COLORS.leader],
    [AVERAGE_LABEL, HOME_COLORS.average],
    ...(compareLabel ? [[compareLabel, HOME_COLORS.compare] as [string, string]] : []),
    ...segmentNames.map((name, index) => [name, segmentColors[index]!] as [string, string]),
  ]);
  const topOrder = [ME_LABEL, LEADER_LABEL, AVERAGE_LABEL, ...(compareLabel ? [compareLabel] : [])];

  return defineChart(composed, {
    focus: "group-x",
    maxFocusDistance: Number.POSITIVE_INFINITY,
    tooltip: {
      use: tooltip,
      className: "p-chart-tooltip",
      content: (points: readonly ChartPoint[]) => {
        // Una fila por serie del panel superior (el área, la línea y el rótulo emiten el mismo punto)
        const bySeries = new Map<string, ChartPoint>();
        // Los tramos de la barra: el valor de cada uno sale de su fila, no del extremo acumulado de la barra
        const segments = new Map<string, SegmentRow>();
        for (const point of points) {
          const datum = point.datum as TopRow | SegmentRow;
          if ("segment" in datum) {
            segments.set(datum.segment, datum);
          } else if (typeof point.yValue === "number" && topOrder.includes(point.groupLabel) && !bySeries.has(point.groupLabel)) {
            bySeries.set(point.groupLabel, point);
          }
        }
        const gpCode = String(points[0]?.xValue ?? "");
        const total = [...segments.values()].reduce((sum, segment) => sum + segment.points, 0);

        return {
          title: gpNames.get(gpCode) ?? gpCode,
          rows: [
            ...topOrder
              .filter((label) => bySeries.has(label))
              .map((label) => ({
                label,
                value: Number(bySeries.get(label)!.yValue).toLocaleString("es-ES"),
                color: colorOf.get(label),
              })),
            ...segmentNames
              .filter((name) => segments.has(name))
              .map((name) => ({ label: name, value: `${segments.get(name)!.points} pts`, color: colorOf.get(name) })),
            ...(segments.size > 0 ? [{ label: "Total del GP", value: `${total} pts` }] : []),
          ],
        };
      },
    },
  });
}
