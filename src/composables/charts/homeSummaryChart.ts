import { defineChart, dot, lineY, ruleY, text } from "@tanstack/charts";
import type { ChartPoint } from "@tanstack/charts";
import { d3Curve } from "@tanstack/charts/d3/shape";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import { alignX, composeViews, grid } from "@tanstack/charts/view";
import { curveBumpX } from "d3-shape";
import { gpBandScale } from "@/composables/charts/chartScales";
import { truncateLabel } from "@/composables/charts/chartText";
import { endLabelOffsets } from "@/composables/charts/endLabels";
import { formatDelta } from "@/composables/charts/accumulatedView";
import {
  BOTTOM_PANEL_GROW,
  HOME_CHART_HEIGHT,
  HOME_COLORS,
  LABEL_FONT_SIZE,
  PANEL_GAP,
  TOP_PANEL_GROW,
} from "@/composables/charts/homeStyle";
import {
  createPointsByGpView,
  RIGHT_MARGIN,
  SEGMENT_COLORS,
  SEGMENT_NAMES,
  type SegmentRow,
} from "@/composables/charts/homePointsByGpView";
import type { CommunityPoint, SeriesPoint } from "@/composables/charts/homeSeason";
import type { GrandPrix } from "@/types/GrandPrix";

/** `leader`: tu diferencia con el líder; `ahead`: la diferencia con otro usuario; `position`: tu puesto tras cada GP */
export type SummaryMode = "leader" | "ahead" | "position";

const ME_LABEL = "Tú";
const AVERAGE_LABEL = "Media";

export interface HomeSummaryInput {
  mode: SummaryMode;
  grandPrixes: readonly GrandPrix[];
  username: string;
  me: readonly SeriesPoint[];
  community: readonly CommunityPoint[];
  winners: ReadonlyMap<string, readonly string[]>;
  /** Usuario con el que se compara en los modos `ahead` y `position` */
  rival?: { name: string; series: readonly SeriesPoint[] };
}

/** Un valor de una línea del panel superior en un GP */
interface LineRow {
  gpCode: string;
  gpName: string;
  label: string;
  value: number | null;
}

interface LineSeries {
  label: string;
  color: string;
  dash?: string;
  width: number;
  /** Curva suave con un punto por GP, como la clasificación del ranking: la posición solo cambia al acabar cada GP */
  bump?: boolean;
  /** Un valor por GP, en el orden de `grandPrixes` */
  values: readonly (number | null)[];
}

const diff = (a: number | null | undefined, b: number | null | undefined): number | null => (
  typeof a === "number" && typeof b === "number" ? a - b : null
);

/** Marcas del eje de posiciones con holgura: todas si hay pocas, y saltos de 2 o 5 si hay muchas */
function positionTicks(maxPosition: number): number[] {
  const step = maxPosition <= 10 ? 1 : maxPosition <= 20 ? 2 : 5;
  return Array.from({ length: maxPosition }, (_, index) => index + 1).filter((value) => value === 1 || value % step === 0);
}

/** Líneas del panel superior según el modo, y la referencia sobre la que se miden */
function seriesFor(input: HomeSummaryInput): { series: LineSeries[]; zeroLabel: string | null; axisLabel: string } {
  const { mode, me, community, rival } = input;

  if (mode === "position") {
    return {
      series: [
        ...(rival ? [{ label: truncateLabel(rival.name, 12), color: HOME_COLORS.compare, width: 2.5, bump: true, values: rival.series.map((point) => point.standings) }] : []),
        { label: ME_LABEL, color: HOME_COLORS.me, width: 4, bump: true, values: me.map((point) => point.standings) },
      ],
      zeroLabel: null,
      axisLabel: "Posición",
    };
  }

  if (mode === "ahead" && rival) {
    const rivalLabel = truncateLabel(rival.name, 12);
    return {
      series: [
        { label: rivalLabel, color: HOME_COLORS.compare, width: 3, values: rival.series.map((point, index) => diff(point.accumulated, me[index]?.accumulated)) },
        { label: AVERAGE_LABEL, color: HOME_COLORS.average, dash: "5 4", width: 2, values: community.map((point, index) => diff(point.averageAccumulated, me[index]?.accumulated)) },
      ],
      zeroLabel: ME_LABEL,
      axisLabel: "Puntos respecto a ti",
    };
  }

  return {
    series: [
      { label: ME_LABEL, color: HOME_COLORS.me, width: 3, values: me.map((point, index) => diff(point.accumulated, community[index]?.leader)) },
      { label: AVERAGE_LABEL, color: HOME_COLORS.average, dash: "5 4", width: 2, values: community.map((point) => diff(point.averageAccumulated, point.leader)) },
    ],
    zeroLabel: "Líder",
    axisLabel: "Puntos respecto al líder",
  };
}

/**
 * Dos paneles con el mismo eje de Grandes Premios. Arriba, lo que separa tu línea de la de referencia
 * (diferencia con el líder, con quien va delante, o tu posición); abajo, tus puntos de cada GP por sesión.
 */
export function buildHomeSummaryChart(input: HomeSummaryInput) {
  const { mode, grandPrixes, username, me, winners } = input;
  const { series, zeroLabel, axisLabel } = seriesFor(input);
  const isPosition = mode === "position";

  const rowsOf = (line: LineSeries): LineRow[] => grandPrixes.map((gp, index) => ({
    gpCode: gp.code,
    gpName: gp.name,
    label: line.label,
    value: line.values[index] ?? null,
  }));
  const seriesRows = series.map((line) => ({ line, rows: rowsOf(line) }));
  const lastRows = seriesRows.flatMap(({ rows }) => rows.filter((row) => row.value !== null).slice(-1));

  const allValues = seriesRows.flatMap(({ rows }) => rows.map((row) => row.value ?? 0));
  const maxPosition = Math.max(3, ...allValues);

  const createTopView = (offsets: ReadonlyMap<string, number>) => defineChart({
    marks: [
      ...(zeroLabel ? [
        ruleY([0], { id: "reference", strokeOpacity: 0.6 }),
        text([{ gpCode: grandPrixes[0]?.code ?? "" }], {
          id: "reference-label",
          x: "gpCode",
          y: () => 0,
          text: () => zeroLabel,
          fill: HOME_COLORS.average,
          anchor: "start",
          dx: 4,
          dy: -8,
          fontSize: 11,
        }),
      ] : []),
      ...seriesRows.flatMap(({ line, rows }) => [
        lineY(rows, {
          id: `${line.label}-line`,
          x: "gpCode",
          y: (row) => row.value,
          z: () => line.label,
          stroke: line.color,
          strokeWidth: line.width,
          strokeDasharray: line.dash,
          curve: line.bump ? d3Curve(curveBumpX) : undefined,
          points: !line.bump && line.label !== AVERAGE_LABEL,
        }),
        ...(line.bump ? [dot(rows.filter((row) => row.value !== null), {
          id: `${line.label}-dots`,
          x: "gpCode",
          y: (row) => row.value,
          fill: line.color,
          r: line.width + 2.5,
        })] : []),
        text(rows.filter((row) => row.value !== null).slice(-1), {
          id: `${line.label}-label`,
          x: "gpCode",
          y: (row) => row.value,
          text: () => line.label,
          fill: line.color,
          anchor: "start",
          dx: 8,
          dy: offsets.get(line.label) ?? 0,
          fontSize: LABEL_FONT_SIZE,
          fontWeight: 600,
        }),
      ]),
    ],
    margin: { right: RIGHT_MARGIN },
    scales: {
      x: { scale: gpBandScale(grandPrixes), axis: false },
      y: isPosition
        ? {
          // Medio puesto de holgura para que el 1º y el último no queden pegados a los bordes
          scale: scaleLinear().domain([0.5, maxPosition + 0.5]),
          reverse: true,
          grid: true,
          axis: { label: axisLabel, ticks: { values: positionTicks(maxPosition), format: (value: number) => `${value}º` } },
        }
        : { scale: scaleLinear, nice: true, grid: true, axis: { label: axisLabel } },
    },
  });

  // Alto del panel superior según el reparto de la rejilla
  const topPanelHeight = Math.round(((HOME_CHART_HEIGHT - PANEL_GAP) * TOP_PANEL_GROW) / (TOP_PANEL_GROW + BOTTOM_PANEL_GROW));
  // Los rótulos del final de cada línea se separan si chocan: primero se mide sin desplazamientos y luego se aplican
  const offsets = endLabelOffsets(
    createTopView(new Map()),
    lastRows.map((row) => ({ key: row.label, value: row.value! })),
    { height: topPanelHeight, fontSize: LABEL_FONT_SIZE },
  );

  const composed = composeViews({
    views: { top: createTopView(offsets), points: createPointsByGpView(grandPrixes, me, winners, username) },
    layout: grid({
      rows: [
        { id: "top", grow: TOP_PANEL_GROW },
        { id: "points", grow: BOTTOM_PANEL_GROW },
      ],
      columns: [{ id: "main", grow: 1 }],
      gap: PANEL_GAP,
      cells: {
        top: { row: "top", column: "main" },
        points: { row: "points", column: "main" },
      },
    }),
    links: [alignX("top", "points")],
  });

  const gpNames = new Map(grandPrixes.map((gp) => [gp.code, gp.name]));
  const colorOf = new Map<string, string>([
    ...series.map((line) => [line.label, line.color] as [string, string]),
    ...SEGMENT_NAMES.map((name, index) => [name, SEGMENT_COLORS[index]!] as [string, string]),
  ]);
  const formatValue = (value: number) => (isPosition ? `${value}º` : formatDelta(value));

  return defineChart(composed, {
    focus: "group-x",
    maxFocusDistance: Number.POSITIVE_INFINITY,
    tooltip: {
      use: tooltip,
      className: "p-chart-tooltip",
      content: (points: readonly ChartPoint[]) => {
        // La línea, el punto y el rótulo de cada serie emiten el mismo punto: una fila por serie
        const lines = new Map<string, LineRow>();
        // El valor de cada tramo de la barra sale de su fila, no del extremo acumulado de la barra
        const segments = new Map<string, SegmentRow>();
        for (const point of points) {
          const datum = point.datum as LineRow | SegmentRow;
          if ("segment" in datum) {
            segments.set(datum.segment, datum);
          } else if (datum.value !== null && !lines.has(datum.label)) {
            lines.set(datum.label, datum);
          }
        }
        const gpCode = String(points[0]?.xValue ?? "");
        const total = [...segments.values()].reduce((sum, segment) => sum + segment.points, 0);

        return {
          title: gpNames.get(gpCode) ?? gpCode,
          rows: [
            ...series
              .filter((line) => lines.has(line.label))
              .map((line) => ({ label: line.label, value: formatValue(lines.get(line.label)!.value!), color: colorOf.get(line.label) })),
            ...SEGMENT_NAMES
              .filter((name) => segments.has(name))
              .map((name) => ({ label: name, value: `${segments.get(name)!.points} pts`, color: colorOf.get(name) })),
            ...(segments.size > 0 ? [{ label: "Total del GP", value: `${total} pts` }] : []),
          ],
        };
      },
    },
  });
}
