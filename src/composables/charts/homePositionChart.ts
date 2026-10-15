import { defineChart, dot, lineY, text } from "@tanstack/charts";
import type { ChartPoint } from "@tanstack/charts";
import { d3Curve } from "@tanstack/charts/d3/shape";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import { curveBumpX } from "d3-shape";
import { gpPointScale } from "@/composables/charts/chartScales";
import { truncateLabel } from "@/composables/charts/chartText";
import { endLabelOffsets } from "@/composables/charts/endLabels";
import { HOME_CHART_HEIGHT, HOME_COLORS, LABEL_FONT_SIZE } from "@/composables/charts/homeStyle";
import type { SeriesPoint } from "@/composables/charts/homeSeason";
import type { GrandPrix } from "@/types/GrandPrix";

const ME_LABEL = "Tú";

interface PositionRow {
  gpCode: string;
  gpName: string;
  who: string;
  standings: number | null;
  previousStandings: number | null;
}

export interface HomePositionInput {
  grandPrixes: readonly GrandPrix[];
  me: readonly SeriesPoint[];
  compare?: { name: string; series: readonly SeriesPoint[] };
}

/** Cambio de posición para el tooltip: `▲2` si has subido, `▼1` si has bajado, `=` si te mantienes */
function movement(row: PositionRow): string {
  if (row.standings === null || row.previousStandings === null) {
    return "";
  }
  const delta = row.previousStandings - row.standings;
  return delta > 0 ? ` ▲${delta}` : delta < 0 ? ` ▼${-delta}` : " =";
}

/** Marcas del eje con holgura: todas si hay pocas, y saltos de 2 o 5 si hay muchas */
function positionTicks(maxPosition: number): number[] {
  const step = maxPosition <= 10 ? 1 : maxPosition <= 20 ? 2 : 5;
  return Array.from({ length: maxPosition }, (_, index) => index + 1).filter((value) => value === 1 || value % step === 0);
}

/**
 * Tu posición en la clasificación tras cada Gran Premio, como un bump chart (1º arriba).
 * Si se compara con otro usuario, su recorrido se dibuja con otro color.
 */
export function buildHomePositionChart({ grandPrixes, me, compare }: HomePositionInput) {
  const compareLabel = compare ? truncateLabel(compare.name, 12) : null;

  const toRows = (series: readonly SeriesPoint[], who: string): PositionRow[] => series.map((point) => ({
    gpCode: point.gpCode,
    gpName: point.gpName,
    who,
    standings: point.standings,
    previousStandings: point.previousStandings,
  }));

  const meRows = toRows(me, ME_LABEL);
  const compareRows = compare && compareLabel ? toRows(compare.series, compareLabel) : [];
  const allRows = [...meRows, ...compareRows];

  const maxPosition = Math.max(3, ...allRows.map((row) => row.standings ?? 0));
  const withValue = (rows: readonly PositionRow[]) => rows.filter((row) => row.standings !== null);

  const lastRows = [meRows, compareRows].flatMap((rows) => withValue(rows).slice(-1));

  const createChart = (offsets: ReadonlyMap<string, number>) => defineChart({
    marks: [
      ...[compareRows, meRows].flatMap((rows) => {
        const isMe = rows === meRows;
        return rows.length === 0 ? [] : [
          lineY(rows, {
            id: `${isMe ? "me" : "compare"}-line`,
            x: "gpCode",
            y: (row) => row.standings,
            color: "who",
            key: (row) => `${row.who}-${row.gpCode}`,
            curve: d3Curve(curveBumpX),
            strokeWidth: isMe ? 4 : 2.5,
          }),
          dot(withValue(rows), {
            id: `${isMe ? "me" : "compare"}-dots`,
            x: "gpCode",
            y: (row) => row.standings,
            color: "who",
            key: (row) => `${row.who}-${row.gpCode}`,
            r: isMe ? 6.5 : 4.5,
          }),
        ];
      }),
      text(lastRows, {
        id: "labels",
        key: (row) => row.who,
        x: "gpCode",
        y: (row) => row.standings,
        text: (row) => row.who,
        color: "who",
        anchor: "start",
        dx: 10,
        dy: (row) => offsets.get(row.who) ?? 0,
        fontSize: LABEL_FONT_SIZE + 1,
        fontWeight: 600,
      }),
    ],
    margin: { right: 104 },
    scales: {
      x: { scale: gpPointScale(grandPrixes), axis: { label: "Grandes Premios" } },
      y: {
        // Medio puesto de holgura para que el 1º y el último no queden pegados a los bordes
        scale: scaleLinear().domain([0.5, maxPosition + 0.5]),
        reverse: true,
        grid: true,
        axis: {
          label: "Posición",
          ticks: { values: positionTicks(maxPosition), format: (value: number) => `${value}º` },
        },
      },
    },
    color: {
      domain: compareLabel ? [ME_LABEL, compareLabel] : [ME_LABEL],
      range: compareLabel ? [HOME_COLORS.me, HOME_COLORS.compare] : [HOME_COLORS.me],
    },
  });

  const offsets = endLabelOffsets(
    createChart(new Map()),
    lastRows.map((row) => ({ key: row.who, value: row.standings! })),
    { height: HOME_CHART_HEIGHT, fontSize: LABEL_FONT_SIZE + 1 },
  );

  const gpNames = new Map(grandPrixes.map((gp) => [gp.code, gp.name]));

  return defineChart(createChart(offsets), {
    focus: "group-x",
    maxFocusDistance: Number.POSITIVE_INFINITY,
    tooltip: {
      use: tooltip,
      className: "p-chart-tooltip",
      content: (points: readonly ChartPoint[]) => {
        // La línea, el punto y la etiqueta de cada serie emiten el mismo punto: una fila por serie
        const byWho = new Map<string, PositionRow>();
        for (const point of points) {
          const row = point.datum as PositionRow;
          if (row.standings !== null && !byWho.has(row.who)) {
            byWho.set(row.who, row);
          }
        }
        const rows = [...byWho.values()].sort((a, b) => (a.standings ?? 0) - (b.standings ?? 0));
        const gpCode = String(points[0]?.xValue ?? "");

        return {
          title: gpNames.get(gpCode) ?? gpCode,
          rows: rows.map((row) => ({
            label: row.who,
            value: `${row.standings}º${movement(row)}`,
            color: row.who === ME_LABEL ? HOME_COLORS.me : HOME_COLORS.compare,
          })),
        };
      },
    },
  });
}
