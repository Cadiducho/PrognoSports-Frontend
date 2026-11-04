import { barY, colorLegend, colorLegendItems, defineChart, text } from "@tanstack/charts";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { gpBandScale } from "@/composables/charts/chartScales";
import { BONUS_COLOR, BONUS_LABEL, SESSION_COLORS } from "@/composables/charts/homeStyle";
import { SESSION_ORDER, type SeriesPoint, sessionName } from "@/composables/charts/homeSeason";
import type { GrandPrix } from "@/types/GrandPrix";

/** Un tramo de la barra apilada de un GP: una sesión o el bonus */
export interface SegmentRow {
  gpCode: string;
  gpName: string;
  segment: string;
  points: number;
}

interface TrophyRow {
  gpCode: string;
  total: number;
}

// Hueco a la derecha de los paneles para los rótulos del final de cada línea
export const RIGHT_MARGIN = 88;

/** Los puntos de un GP desglosados por sesión; lo que no explican las sesiones se muestra como bonus */
export function segmentsOf(point: SeriesPoint): SegmentRow[] {
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

export const SEGMENT_NAMES = [...SESSION_ORDER.map(sessionName), BONUS_LABEL];
export const SEGMENT_COLORS = [...SESSION_ORDER.map((id) => SESSION_COLORS[id]!), BONUS_COLOR];

/**
 * Panel de barras con los puntos de cada GP apilados por sesión (y bonus), con 🏆 en los GPs que ganaste.
 * Comparte el eje X de Grandes Premios con el panel que se coloque encima.
 */
export function createPointsByGpView(
  grandPrixes: readonly GrandPrix[],
  me: readonly SeriesPoint[],
  winners: ReadonlyMap<string, readonly string[]>,
  username: string,
) {
  const segmentRows = me.flatMap(segmentsOf);
  const trophyRows: TrophyRow[] = me.flatMap((point) => (
    point.pointsInGP !== null && point.pointsInGP > 0 && winners.get(point.gpCode)?.includes(username)
      ? [{ gpCode: point.gpCode, total: point.pointsInGP }]
      : []
  ));

  return defineChart({
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
      domain: SEGMENT_NAMES,
      range: SEGMENT_COLORS,
      // Leyenda compacta, centrada y sin columnas de igual ancho, para que quepa en una sola fila
      legend: colorLegend({ placement: "bottom", items: colorLegendItems({ justify: "center", gap: 16, rowGap: 4 }) }),
    },
  });
}
