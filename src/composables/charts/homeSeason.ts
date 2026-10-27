import type { GrandPrix } from "@/types/GrandPrix";
import type { UserPoints } from "@/types/UserPoints";
import { RaceSession } from "@/types/RaceSession";
import type { Dictionary } from "@/types/Dictionary";

/** Respuesta de `scoreService.getUserPointsByGP`: id de GP -> usuario -> puntos */
export type PointsByGp = Dictionary<string, Dictionary<string, UserPoints>>;

export type HomeWindow = "season" | "last5";

/** Ids de sesión en el orden en que se apilan las barras: clasificación, clasif. sprint, sprint y carrera */
export const SESSION_ORDER = [1, 3, 4, 2] as const;

export const WINDOW_SIZE: Record<HomeWindow, number> = { season: Infinity, last5: 5 };

export const sessionName = (id: number): string => RaceSession.findById(id)?.humanName() ?? `Sesión ${id}`;

/** Puntos de todos los usuarios en un Gran Premio */
export function entriesOf(pointsByGp: PointsByGp, gp: GrandPrix): UserPoints[] {
  return Object.values(pointsByGp[String(gp.id)] ?? {}).filter((entry): entry is UserPoints => !!entry);
}

/** Solo los Grandes Premios que ya tienen puntos, en el orden de la temporada */
export function playedGps(gps: readonly GrandPrix[], pointsByGp: PointsByGp): GrandPrix[] {
  return gps.filter((gp) => entriesOf(pointsByGp, gp).length > 0);
}

export function windowGps(played: readonly GrandPrix[], window: HomeWindow): GrandPrix[] {
  const size = WINDOW_SIZE[window];
  return Number.isFinite(size) ? played.slice(-size) : [...played];
}

/** Un usuario en un Gran Premio. `null` significa "sin dato": deja un hueco en la gráfica. */
export interface SeriesPoint {
  gpCode: string;
  gpName: string;
  username: string;
  accumulated: number | null;
  pointsInGP: number | null;
  bonusPoints: number;
  pointsBySession: Partial<Record<number, number>>;
  /** Porcentaje de acierto del GP, de 0 a 100 */
  hitPercentage: number | null;
  standings: number | null;
  /** Posición tras el GP anterior; null si no había */
  previousStandings: number | null;
}

export function userSeries(gps: readonly GrandPrix[], pointsByGp: PointsByGp, username: string): SeriesPoint[] {
  return gps.map((gp) => {
    const entry = entriesOf(pointsByGp, gp).find((candidate) => candidate.user.username === username);
    const hits = entry?.hitPercentageInGP;
    return {
      gpCode: gp.code,
      gpName: gp.name,
      username,
      accumulated: entry ? entry.accumulatedPoints : null,
      pointsInGP: entry ? entry.pointsInGP : null,
      bonusPoints: entry?.bonusPoints ?? 0,
      pointsBySession: entry?.pointsBySession ?? {},
      // La API da una fracción y usa un valor negativo cuando no hay dato
      hitPercentage: typeof hits === "number" && hits >= 0 ? Math.round(hits * 1000) / 10 : null,
      standings: entry && entry.standings > 0 ? entry.standings : null,
      previousStandings: entry && entry.previousStandings > 0 ? entry.previousStandings : null,
    };
  });
}

/** La comunidad en un Gran Premio: líder y medias */
export interface CommunityPoint {
  gpCode: string;
  gpName: string;
  leader: number | null;
  averageAccumulated: number | null;
  averagePointsInGP: number | null;
  averageHitPercentage: number | null;
}

const mean = (values: readonly number[]): number | null => (
  values.length > 0 ? Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10 : null
);

export function communitySeries(gps: readonly GrandPrix[], pointsByGp: PointsByGp): CommunityPoint[] {
  return gps.map((gp) => {
    const entries = entriesOf(pointsByGp, gp);
    const accumulated = entries.map((entry) => entry.accumulatedPoints);
    return {
      gpCode: gp.code,
      gpName: gp.name,
      leader: accumulated.length > 0 ? Math.max(...accumulated) : null,
      averageAccumulated: mean(accumulated),
      averagePointsInGP: mean(entries.map((entry) => entry.pointsInGP)),
      averageHitPercentage: mean(
        entries.map((entry) => entry.hitPercentageInGP).filter((hits) => hits >= 0).map((hits) => hits * 100),
      ),
    };
  });
}

/** Ganadores de cada GP (por código): máximo de puntos del GP, distinto de 0. Misma regla que el ranking. */
export function gpWinners(gps: readonly GrandPrix[], pointsByGp: PointsByGp): Map<string, string[]> {
  const winners = new Map<string, string[]>();
  for (const gp of gps) {
    const entries = entriesOf(pointsByGp, gp);
    const best = Math.max(...entries.map((entry) => entry.pointsInGP), 0);
    winners.set(
      gp.code,
      best === 0 ? [] : entries.filter((entry) => entry.pointsInGP === best).map((entry) => entry.user.username),
    );
  }
  return winners;
}

/** Usuarios con puntos, de mejor a peor según el último GP jugado (para el selector de comparación y los colores) */
export function rankedUsernames(played: readonly GrandPrix[], pointsByGp: PointsByGp): string[] {
  const last = played[played.length - 1];
  if (!last) {
    return [];
  }
  return entriesOf(pointsByGp, last)
    .filter((entry) => entry.accumulatedPoints !== 0)
    .sort((a, b) => b.accumulatedPoints - a.accumulatedPoints || a.user.username.localeCompare(b.user.username))
    .map((entry) => entry.user.username);
}

export interface SessionAverage {
  sessionId: number;
  sessionName: string;
  average: number;
}

/**
 * Media de puntos por sesión de un usuario, o de toda la comunidad si `username` es null.
 * Solo cuentan las sesiones en las que hay dato.
 */
export function sessionAverages(
  gps: readonly GrandPrix[],
  pointsByGp: PointsByGp,
  username: string | null,
): SessionAverage[] {
  return SESSION_ORDER.flatMap((sessionId) => {
    const values: number[] = [];
    for (const gp of gps) {
      for (const entry of entriesOf(pointsByGp, gp)) {
        const points = entry.pointsBySession?.[sessionId];
        if ((username === null || entry.user.username === username) && typeof points === "number") {
          values.push(points);
        }
      }
    }
    const average = mean(values);
    return average === null ? [] : [{ sessionId, sessionName: sessionName(sessionId), average }];
  });
}

export interface FormStats {
  /** Media de puntos por GP de los últimos GPs jugados */
  recentAverage: number;
  /** Media de puntos por GP de toda la temporada */
  seasonAverage: number;
  /** Cuántos GPs entran en `recentAverage` */
  recentCount: number;
  /** GPs consecutivos, hasta el último, con más puntos que la media de la comunidad */
  streak: number;
}

const FORM_GPS = 3;

/** Forma reciente y racha. Devuelve null si el usuario aún no tiene puntos en ningún GP. */
export function computeForm(series: readonly SeriesPoint[], community: readonly CommunityPoint[]): FormStats | null {
  const played = series.filter((point) => point.pointsInGP !== null);
  if (played.length === 0) {
    return null;
  }
  const average = (points: readonly SeriesPoint[]) => points.reduce((sum, point) => sum + (point.pointsInGP ?? 0), 0) / points.length;
  const recent = played.slice(-FORM_GPS);
  const averageByGp = new Map(community.map((point) => [point.gpCode, point.averagePointsInGP]));

  let streak = 0;
  for (let index = played.length - 1; index >= 0; index--) {
    const point = played[index]!;
    const communityAverage = averageByGp.get(point.gpCode);
    if (communityAverage === null || communityAverage === undefined || (point.pointsInGP ?? 0) <= communityAverage) {
      break;
    }
    streak++;
  }

  return {
    recentAverage: Math.round(average(recent) * 10) / 10,
    seasonAverage: Math.round(average(played) * 10) / 10,
    recentCount: recent.length,
    streak,
  };
}

/** Cifras de la tarjeta de KPIs del Inicio */
export interface HomeKpis {
  position: LatestPosition | null;
  points: number;
  /** Puntos que le faltan al líder; 0 si lo eres tú */
  gapToLeader: number;
  /** Media de puntos por GP del usuario; null si aún no ha puntuado */
  average: number | null;
  /** Media de puntos por GP de toda la comunidad */
  communityAverage: number | null;
  wins: number;
  /** GPs en los que el usuario tiene puntos */
  played: number;
}

export function homeKpis(played: readonly GrandPrix[], pointsByGp: PointsByGp, username: string): HomeKpis {
  const series = userSeries(played, pointsByGp, username);
  const community = communitySeries(played, pointsByGp);
  const form = computeForm(series, community);
  // Si el usuario no tiene entrada en el último GP, vale su último acumulado y el líder de ese mismo GP
  const lastIndex = series.reduce((found, point, index) => (point.accumulated !== null ? index : found), -1);
  const leader = lastIndex === -1 ? null : community[lastIndex]?.leader ?? null;
  const points = lastIndex === -1 ? 0 : series[lastIndex]!.accumulated ?? 0;
  const communityAverages = community.flatMap((point) => (point.averagePointsInGP === null ? [] : [point.averagePointsInGP]));
  const winners = gpWinners(played, pointsByGp);

  return {
    position: latestPosition(series),
    points,
    gapToLeader: leader === null ? 0 : Math.max(leader - points, 0),
    average: form?.seasonAverage ?? null,
    communityAverage: mean(communityAverages),
    wins: [...winners.values()].filter((names) => names.includes(username)).length,
    played: series.filter((point) => point.pointsInGP !== null).length,
  };
}

/** Una fila de «Tu entorno en el ranking» */
export interface NeighbourRow {
  position: number;
  username: string;
  isMe: boolean;
  accumulated: number;
  /** Puntos de diferencia con el usuario (positivo = va por delante) */
  gap: number;
}

/** Clasificación, de mejor a peor, del último GP jugado en el que `username` tiene entrada */
function lastStandings(played: readonly GrandPrix[], pointsByGp: PointsByGp, username: string): UserPoints[] {
  for (let index = played.length - 1; index >= 0; index--) {
    const entries = entriesOf(pointsByGp, played[index]!);
    if (entries.some((entry) => entry.user.username === username)) {
      return entries.sort((a, b) => (
        b.accumulatedPoints - a.accumulatedPoints
        || a.standings - b.standings
        || a.user.username.localeCompare(b.user.username)
      ));
    }
  }
  return [];
}

/**
 * Las `radius` posiciones por encima y por debajo del usuario en el último GP jugado. Cerca de los extremos
 * la ventana se desplaza para mantener el mismo número de filas.
 */
export function standingsNeighbours(
  played: readonly GrandPrix[],
  pointsByGp: PointsByGp,
  username: string,
  radius = 2,
): NeighbourRow[] {
  const sorted = lastStandings(played, pointsByGp, username);
  const index = sorted.findIndex((entry) => entry.user.username === username);
  if (index === -1) {
    return [];
  }
  const size = radius * 2 + 1;
  const start = Math.max(0, Math.min(index - radius, sorted.length - size));
  const me = sorted[index]!;
  return sorted.slice(start, start + size).map((entry, offset) => ({
    position: entry.standings > 0 ? entry.standings : start + offset + 1,
    username: entry.user.username,
    isMe: entry.user.username === username,
    accumulated: entry.accumulatedPoints,
    gap: entry.accumulatedPoints - me.accumulatedPoints,
  }));
}

export interface RivalAhead {
  username: string;
  /** `ahead`: va justo por delante de ti; `behind`: eres el líder y es el segundo */
  relation: "ahead" | "behind";
}

/** Con quién compara el modo «Con el de delante»: el usuario justo por encima o, si eres el líder, el siguiente */
export function userAhead(played: readonly GrandPrix[], pointsByGp: PointsByGp, username: string): RivalAhead | null {
  const sorted = lastStandings(played, pointsByGp, username);
  const index = sorted.findIndex((entry) => entry.user.username === username);
  if (index === -1) {
    return null;
  }
  if (index > 0) {
    return { username: sorted[index - 1]!.user.username, relation: "ahead" };
  }
  const next = sorted[1];
  return next ? { username: next.user.username, relation: "behind" } : null;
}

export interface LatestPosition {
  gpCode: string;
  standings: number;
  /** Posiciones ganadas respecto al GP anterior (positivo = has subido); null si no había posición anterior */
  delta: number | null;
}

/** Última posición conocida del usuario y cuánto ha cambiado respecto al GP anterior */
export function latestPosition(series: readonly SeriesPoint[]): LatestPosition | null {
  const last = [...series].reverse().find((point) => point.standings !== null);
  if (!last || last.standings === null) {
    return null;
  }
  return {
    gpCode: last.gpCode,
    standings: last.standings,
    delta: last.previousStandings === null ? null : last.previousStandings - last.standings,
  };
}
