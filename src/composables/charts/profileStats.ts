import type { SeriesPoint } from "@/composables/charts/homeSeason";

export interface ProfileHighlights {
  /** Grandes Premios en los que el usuario ha puntuado o participado */
  gpsPlayed: number;
  /** Mejor Gran Premio por puntos */
  bestGp: { gpName: string; gpCode: string; points: number } | null;
  /** Mejor posición alcanzada en la clasificación */
  bestPosition: { standings: number; gpCode: string } | null;
  /** Porcentaje medio de acierto por GP, de 0 a 100 */
  averageHitPercentage: number | null;
  /** Media de puntos por GP */
  averagePointsPerGp: number | null;
}

/** Datos destacados de un usuario a partir de su serie de la temporada (solo GPs jugados) */
export function computeProfileHighlights(series: readonly SeriesPoint[]): ProfileHighlights | null {
  const played = series.filter((point) => point.pointsInGP !== null);
  if (played.length === 0) {
    return null;
  }

  let best: SeriesPoint | null = null;
  for (const point of played) {
    if (best === null || (point.pointsInGP ?? 0) > (best.pointsInGP ?? 0)) {
      best = point;
    }
  }

  let bestPosition: ProfileHighlights["bestPosition"] = null;
  for (const point of played) {
    if (point.standings !== null && (bestPosition === null || point.standings < bestPosition.standings)) {
      bestPosition = { standings: point.standings, gpCode: point.gpCode };
    }
  }

  const hits = played.map((point) => point.hitPercentage).filter((value): value is number => value !== null);
  const totalPoints = played.reduce((sum, point) => sum + (point.pointsInGP ?? 0), 0);

  return {
    gpsPlayed: played.length,
    bestGp: best && best.pointsInGP !== null && best.pointsInGP > 0
      ? { gpName: best.gpName, gpCode: best.gpCode, points: best.pointsInGP }
      : null,
    bestPosition,
    averageHitPercentage: hits.length > 0 ? Math.round((hits.reduce((sum, value) => sum + value, 0) / hits.length) * 10) / 10 : null,
    averagePointsPerGp: Math.round((totalPoints / played.length) * 10) / 10,
  };
}
