import type { RankingLinePoint } from "@/pages/ranking/types/ranking";

/**
 * Cómo se dibujan los puntos acumulados:
 * - leader: diferencia con el líder de cada GP (el líder queda en 0)
 * - me: diferencia con el usuario actual (tú en 0)
 * - total: puntos acumulados sin transformar
 */
export type AccumulatedMode = "leader" | "me" | "total";

const MINUS = "−";

/** Diferencia con signo para ejes y tooltips: `+12`, `−8`, `0` */
export function formatDelta(value: number): string {
  if (value === 0) {
    return "0";
  }
  const magnitude = Math.abs(Math.round(value * 10) / 10).toLocaleString("es-ES");
  return value > 0 ? `+${magnitude}` : `${MINUS}${magnitude}`;
}

/**
 * Convierte el acumulado de cada usuario en la diferencia con una referencia por GP.
 * El líder se calcula con todos los usuarios (no solo los visibles) para que el eje no se mueva al filtrar.
 * El total original se conserva en `total` para el tooltip. Si no hay referencia en un GP, el valor es null.
 */
export function toAccumulatedView(
  rows: readonly RankingLinePoint[],
  mode: AccumulatedMode,
  currentUsername: string,
): RankingLinePoint[] {
  if (mode === "total") {
    return [...rows];
  }

  const reference = new Map<string, number>();
  for (const row of rows) {
    if (row.value === null) {
      continue;
    }
    if (mode === "leader") {
      reference.set(row.gpCode, Math.max(reference.get(row.gpCode) ?? -Infinity, row.value));
    } else if (row.username === currentUsername) {
      reference.set(row.gpCode, row.value);
    }
  }

  if (mode === "me") {
    // Los puntos acumulados no bajan: si tú no tienes dato en un GP, tu referencia es el último acumulado conocido.
    // Sin esto, un solo hueco tuyo cortaría la gráfica entera en ese GP.
    const gpOrder = [...new Set(rows.map((row) => row.gpCode))];
    let last: number | undefined;
    for (const gpCode of gpOrder) {
      const known = reference.get(gpCode);
      if (known !== undefined) {
        last = known;
      } else if (last !== undefined) {
        reference.set(gpCode, last);
      }
    }
  }

  return rows.map((row) => {
    const base = reference.get(row.gpCode);
    return {
      ...row,
      total: row.value,
      value: row.value === null || base === undefined ? null : row.value - base,
    };
  });
}
