import {
  communitySeries,
  entriesOf,
  type PointsByGp,
  SESSION_ORDER,
  type SeriesPoint,
  sessionName,
  userSeries,
} from "@/composables/charts/homeSeason";
import type { GrandPrix } from "@/types/GrandPrix";

const round1 = (value: number) => Math.round(value * 10) / 10;

/** Un Gran Premio con un valor destacado: «Gran Premio de España: 87 pts» */
export interface GpMark {
  gpName: string;
  value: number;
}

/** Tu diferencia de puntos con el rival en cada GP (positiva = ganas tú) */
export interface HeadToHeadRow {
  gpCode: string;
  gpName: string;
  diff: number | null;
}

export interface HeadToHeadSession {
  sessionId: number;
  sessionName: string;
  wins: number;
  losses: number;
}

export interface HeadToHead {
  rows: HeadToHeadRow[];
  wins: number;
  losses: number;
  ties: number;
  /** Tus puntos acumulados menos los del rival tras el último GP con dato; null si aún no coinciden en ningún GP */
  accumulatedDiff: number | null;
  biggestWin: GpMark | null;
  biggestLoss: GpMark | null;
  bySession: HeadToHeadSession[];
}

/** Duelo directo con otro usuario, GP a GP y sesión a sesión. Solo cuentan los GPs en los que ambos tienen puntos. */
export function headToHead(me: readonly SeriesPoint[], rival: readonly SeriesPoint[]): HeadToHead {
  const rows: HeadToHeadRow[] = me.map((mine, index) => {
    const theirs = rival[index];
    const diff = mine.pointsInGP !== null && theirs?.pointsInGP !== null && theirs?.pointsInGP !== undefined
      ? mine.pointsInGP - theirs.pointsInGP
      : null;
    return { gpCode: mine.gpCode, gpName: mine.gpName, diff };
  });
  const compared = rows.filter((row): row is HeadToHeadRow & { diff: number } => row.diff !== null);

  const lastBoth = [...me.keys()].reverse().find((index) => me[index]!.accumulated !== null && rival[index]?.accumulated != null);
  const accumulatedDiff = lastBoth === undefined ? null : me[lastBoth]!.accumulated! - rival[lastBoth]!.accumulated!;

  const best = compared.reduce<GpMark | null>((acc, row) => (row.diff > 0 && (!acc || row.diff > acc.value) ? { gpName: row.gpName, value: row.diff } : acc), null);
  const worst = compared.reduce<GpMark | null>((acc, row) => (row.diff < 0 && (!acc || -row.diff > acc.value) ? { gpName: row.gpName, value: -row.diff } : acc), null);

  const bySession = SESSION_ORDER.flatMap((sessionId) => {
    let wins = 0;
    let losses = 0;
    me.forEach((mine, index) => {
      const mineValue = mine.pointsBySession[sessionId];
      const theirValue = rival[index]?.pointsBySession[sessionId];
      if (typeof mineValue === "number" && typeof theirValue === "number") {
        wins += mineValue > theirValue ? 1 : 0;
        losses += mineValue < theirValue ? 1 : 0;
      }
    });
    return wins + losses === 0 ? [] : [{ sessionId, sessionName: sessionName(sessionId), wins, losses }];
  });

  return {
    rows,
    wins: compared.filter((row) => row.diff > 0).length,
    losses: compared.filter((row) => row.diff < 0).length,
    ties: compared.filter((row) => row.diff === 0).length,
    accumulatedDiff,
    biggestWin: best,
    biggestLoss: worst,
    bySession,
  };
}

/** Racha en curso y mejor racha de una condición, contando solo los GPs en los que hay dato */
export interface Streak {
  current: number;
  best: number;
}

function streakOf(flags: readonly (boolean | null)[]): Streak {
  let current = 0;
  let best = 0;
  for (const flag of flags) {
    // Un GP sin dato (null) no corta la racha, igual que en `computeForm`; uno jugado que no cumple sí
    if (flag === null) {
      continue;
    }
    current = flag ? current + 1 : 0;
    best = Math.max(best, current);
  }
  return { current, best };
}

export interface SeasonRecords {
  bestGp: GpMark | null;
  worstGp: GpMark | null;
  /** Mejor puesto en la general y en qué GP se alcanzó por primera vez */
  bestPosition: { standings: number; gpName: string } | null;
  /** Desviación típica de tus puntos por GP: cuanto menor, más regular */
  consistency: number | null;
  /** De media, a qué porcentaje de la comunidad superas en cada GP, de 0 a 100 */
  averagePercentile: number | null;
  /** GPs jugados con puntos */
  played: number;
  streaks: {
    aboveAverage: Streak;
    podium: Streak;
    climbing: Streak;
  };
  /** GPs que has terminado como líder de la general */
  gpsAsLeader: number;
}

/** Posición de `username` entre los puntos de un GP (1 = más puntos) y a cuántos usuarios supera */
function gpStanding(entries: readonly { user: { username: string }; pointsInGP: number }[], username: string) {
  const mine = entries.find((entry) => entry.user.username === username);
  if (!mine) {
    return null;
  }
  const above = entries.filter((entry) => entry.pointsInGP > mine.pointsInGP).length;
  const below = entries.filter((entry) => entry.pointsInGP < mine.pointsInGP).length;
  return { rank: above + 1, below, others: entries.length - 1 };
}

/** Mejores y peores momentos de la temporada y tus rachas, a partir de los puntos de todos los GPs jugados */
export function seasonRecords(gps: readonly GrandPrix[], pointsByGp: PointsByGp, username: string): SeasonRecords {
  const series = userSeries(gps, pointsByGp, username);
  const community = communitySeries(gps, pointsByGp);
  const scored = series.filter((point): point is SeriesPoint & { pointsInGP: number } => point.pointsInGP !== null);

  const best = scored.reduce<GpMark | null>((acc, point) => (!acc || point.pointsInGP > acc.value ? { gpName: point.gpName, value: point.pointsInGP } : acc), null);
  const worst = scored.reduce<GpMark | null>((acc, point) => (!acc || point.pointsInGP < acc.value ? { gpName: point.gpName, value: point.pointsInGP } : acc), null);

  const positioned = series.filter((point): point is SeriesPoint & { standings: number } => point.standings !== null);
  const bestPosition = positioned.reduce<{ standings: number; gpName: string } | null>(
    (acc, point) => (!acc || point.standings < acc.standings ? { standings: point.standings, gpName: point.gpName } : acc),
    null,
  );

  const mean = scored.length > 0 ? scored.reduce((sum, point) => sum + point.pointsInGP, 0) / scored.length : 0;
  const consistency = scored.length >= 2
    ? round1(Math.sqrt(scored.reduce((sum, point) => sum + (point.pointsInGP - mean) ** 2, 0) / scored.length))
    : null;

  const standings = gps.map((gp) => gpStanding(entriesOf(pointsByGp, gp), username));
  const percentiles = standings.flatMap((standing) => (standing && standing.others > 0 ? [(standing.below / standing.others) * 100] : []));

  return {
    bestGp: best,
    worstGp: scored.length >= 2 ? worst : null,
    bestPosition,
    consistency,
    averagePercentile: percentiles.length > 0 ? Math.round(percentiles.reduce((sum, value) => sum + value, 0) / percentiles.length) : null,
    played: scored.length,
    streaks: {
      aboveAverage: streakOf(series.map((point, index) => {
        const average = community[index]?.averagePointsInGP;
        return point.pointsInGP === null || average === null || average === undefined ? null : point.pointsInGP > average;
      })),
      podium: streakOf(series.map((point, index) => {
        const standing = standings[index];
        return point.pointsInGP === null || !standing ? null : point.pointsInGP > 0 && standing.rank <= 3;
      })),
      climbing: streakOf(series.map((point) => (
        point.standings === null || point.previousStandings === null ? null : point.previousStandings > point.standings
      ))),
    },
    gpsAsLeader: series.filter((point) => point.standings === 1).length,
  };
}
