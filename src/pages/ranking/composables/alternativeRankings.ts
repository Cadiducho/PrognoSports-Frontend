import type { GrandPrix } from "@/types/GrandPrix";
import type { UserPoints } from "@/types/UserPoints";
import { SESSION_ORDER, sessionName } from "@/composables/charts/homeSeason";
import { BONUS_COLOR, HOME_COLORS, SESSION_COLORS } from "@/composables/charts/homeStyle";
import type { AlternativeRanking, TableEntry } from "@/pages/ranking/types/ranking";

/** Suma `pick` de todos los GPs en los que participó el usuario; null si no hay ningún dato */
function sumOver(entry: TableEntry, grandPrixes: readonly GrandPrix[], pick: (points: UserPoints) => number | undefined): number | null {
  let total = 0;
  let hasData = false;
  for (const gp of grandPrixes) {
    const points = entry.gps.get(gp.id);
    const value = points ? pick(points) : undefined;
    if (typeof value === "number") {
      total += value;
      hasData = true;
    }
  }
  return hasData ? total : null;
}

function buildRanking(
  base: Pick<AlternativeRanking, "key" | "title" | "color" | "unit">,
  rows: readonly TableEntry[],
  valueOf: (entry: TableEntry) => number | null,
): AlternativeRanking | null {
  const scored = rows
    .map((entry, index) => ({ entry, realPosition: index + 1, value: valueOf(entry) }))
    .filter((item): item is { entry: TableEntry; realPosition: number; value: number } => item.value !== null)
    .sort((a, b) => b.value - a.value || a.realPosition - b.realPosition);

  if (scored.length === 0) {
    return null;
  }

  return {
    ...base,
    rows: scored.map((item, index) => ({
      user: item.entry.user,
      value: item.value,
      position: index + 1,
      realPosition: item.realPosition,
      delta: item.realPosition - (index + 1),
    })),
  };
}

/**
 * Rankings alternativos a partir de las filas con `totalScore` rellenado (las de `byGpRows`; las de acumulado lo tienen a 0).
 * Las tarjetas sin ningún dato (p. ej. sprint en una competición sin sprint) se omiten.
 */
export function buildAlternativeRankings(rows: readonly TableEntry[], grandPrixes: readonly GrandPrix[]): AlternativeRanking[] {
  const ranked = [...rows].sort((a, b) => b.totalScore - a.totalScore);

  const bySession = SESSION_ORDER.map((sessionId) => buildRanking(
    { key: `session-${sessionId}`, title: `Solo ${sessionName(sessionId)}`, color: SESSION_COLORS[sessionId]! },
    ranked,
    (entry) => sumOver(entry, grandPrixes, (points) => points.pointsBySession?.[sessionId]),
  ));

  const withoutBonus = buildRanking(
    { key: "no-bonus", title: "Sin bonus de aciertos", color: BONUS_COLOR },
    ranked,
    (entry) => sumOver(entry, grandPrixes, (points) => points.pointsInGP - (points.bonusPoints ?? 0)),
  );

  const byHits = buildRanking(
    { key: "hits", title: "Por aciertos", color: HOME_COLORS.compare, unit: "aciertos" },
    ranked,
    (entry) => sumOver(entry, grandPrixes, (points) => (points.hitsInGP >= 0 ? points.hitsInGP : undefined)),
  );

  const real = buildRanking(
    { key: "real", title: "Clasificación real", color: HOME_COLORS.me },
    ranked,
    (entry) => entry.totalScore,
  );

  return [...bySession, withoutBonus, byHits, real].filter((ranking): ranking is AlternativeRanking => ranking !== null);
}
