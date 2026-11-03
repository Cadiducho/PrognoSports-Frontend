import {grandPrixService} from "@/_services";
import {GrandPrix} from "@/types/GrandPrix";
import {RaceResult} from "@/types/RaceResult";
import {RaceSession} from "@/types/RaceSession";
import {Season} from "@/types/Season";

/**
 * Resultados de una sesión concreta de un Gran Premio
 */
export interface SessionResults {
  gp: GrandPrix;
  session: RaceSession;
  results: Array<RaceResult>;
}

/**
 * Un resultado individual de un piloto en una sesión
 */
export interface ResultEntry {
  gp: GrandPrix;
  sessionName: string;
  position: number;
  result: RaceResult;
}

export interface StatLine {
  /** Grandes Premios con carrera disputada */
  gps: number;
  /** Resultados de carrera contabilizados (un equipo suma dos por Gran Premio) */
  races: number;
  wins: number;
  podiums: number;
  top10: number;
  poles: number;
  sprintWins: number;
  bestFinish: number | null;
  averageFinish: number | null;
}

const MAX_PARALLEL_REQUESTS = 6;

// Cada temporada se descarga una sola vez por sesión de navegación
const seasonCache = new Map<number, Promise<Array<SessionResults>>>();

async function runPool<T>(tasks: Array<() => Promise<T>>): Promise<Array<T>> {
  const results: Array<T> = new Array(tasks.length);
  let next = 0;
  const workers = Array.from({length: Math.min(MAX_PARALLEL_REQUESTS, tasks.length)}, async () => {
    while (next < tasks.length) {
      const index = next++;
      results[index] = await tasks[index]();
    }
  });
  await Promise.all(workers);
  return results;
}

async function fetchSeasonResults(season: Season): Promise<Array<SessionResults>> {
  const now = Date.now();
  const gps = (await grandPrixService.getGrandPrixesList(season))
    .filter(gp => !gp.suspended)
    .sort((a, b) => a.round - b.round);

  const tasks: Array<() => Promise<SessionResults>> = [];
  for (const gp of gps) {
    for (const session of gp.sessions) {
      // No tiene sentido pedir resultados de sesiones que aún no se han disputado
      if (session.date.getTime() > now) continue;
      tasks.push(async () => {
        const results = await grandPrixService.getResults(gp, session).catch(() => [] as Array<RaceResult>);
        return {gp, session, results: results ?? []};
      });
    }
  }

  const sessionResults = await runPool(tasks);
  return sessionResults.filter(sr => sr.results.length > 0);
}

/**
 * Descarga (y cachea) todos los resultados registrados de una temporada.
 * Requiere sesión iniciada, pues la API de resultados es privada.
 */
export function loadSeasonResults(season: Season): Promise<Array<SessionResults>> {
  let promise = seasonCache.get(season.id);
  if (!promise) {
    promise = fetchSeasonResults(season);
    seasonCache.set(season.id, promise);
    // Si falla no se cachea el error
    promise.catch(() => seasonCache.delete(season.id));
  }
  return promise;
}

/**
 * Aplana los resultados de una temporada a los que cumplan el filtro
 */
export function filterEntries(sessions: Array<SessionResults>, predicate: (result: RaceResult) => boolean): Array<ResultEntry> {
  const entries: Array<ResultEntry> = [];
  for (const sr of sessions) {
    for (const result of sr.results) {
      if (predicate(result)) {
        entries.push({gp: sr.gp, sessionName: sr.session.name, position: result.position, result});
      }
    }
  }
  return entries;
}

export function emptyStats(): StatLine {
  return {gps: 0, races: 0, wins: 0, podiums: 0, top10: 0, poles: 0, sprintWins: 0, bestFinish: null, averageFinish: null};
}

export function computeStats(entries: Array<ResultEntry>): StatLine {
  const stats = emptyStats();
  const raceGps = new Set<number>();
  const racePositions: Array<number> = [];

  for (const entry of entries) {
    switch (entry.sessionName) {
      case "RACE":
        raceGps.add(entry.gp.id);
        racePositions.push(entry.position);
        if (entry.position === 1) stats.wins++;
        if (entry.position <= 3) stats.podiums++;
        if (entry.position <= 10) stats.top10++;
        break;
      case "QUALIFY":
        if (entry.position === 1) stats.poles++;
        break;
      case "SPRINT_RACE":
        if (entry.position === 1) stats.sprintWins++;
        break;
    }
  }

  stats.gps = raceGps.size;
  stats.races = racePositions.length;
  if (racePositions.length) {
    stats.bestFinish = Math.min(...racePositions);
    stats.averageFinish = racePositions.reduce((acc, pos) => acc + pos, 0) / racePositions.length;
  }
  return stats;
}

export function sumStats(lines: Array<StatLine>): StatLine {
  const total = emptyStats();
  let weightedAverage = 0;
  let racesCount = 0;
  for (const line of lines) {
    total.gps += line.gps;
    total.wins += line.wins;
    total.podiums += line.podiums;
    total.top10 += line.top10;
    total.poles += line.poles;
    total.sprintWins += line.sprintWins;
    if (line.bestFinish !== null) {
      total.bestFinish = total.bestFinish === null ? line.bestFinish : Math.min(total.bestFinish, line.bestFinish);
    }
    total.races += line.races;
    if (line.averageFinish !== null && line.races > 0) {
      weightedAverage += line.averageFinish * line.races;
      racesCount += line.races;
    }
  }
  total.averageFinish = racesCount ? weightedAverage / racesCount : null;
  return total;
}

export function formatPosition(position?: number | null): string {
  return position ? `P${position}` : "—";
}

export function formatAverage(value: number | null): string {
  return value === null ? "—" : value.toFixed(1);
}
