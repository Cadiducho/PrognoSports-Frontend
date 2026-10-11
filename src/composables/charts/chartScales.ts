import { scaleBand } from "@tanstack/charts/scales/band";
import { scalePoint } from "@tanstack/charts/scales/point";
import type { GrandPrix } from "@/types/GrandPrix";

/** Paleta categórica para usuarios: se reparte por orden de clasificación y se repite si hay más de 12. */
export const USER_PALETTE = [
  "#8b5cf6", "#22c55e", "#f59e0b", "#0ea5e9", "#ec4899", "#14b8a6",
  "#ef4444", "#84cc16", "#6366f1", "#f97316", "#06b6d4", "#a855f7",
];

/**
 * Dominio y rango de color estables por usuario, para que conserve su color
 * al filtrar la leyenda o cambiar de pestaña.
 */
export function userColorOptions(usernames: readonly string[]) {
  return {
    domain: [...usernames],
    range: usernames.map((_, index) => USER_PALETTE[index % USER_PALETTE.length]!),
  };
}

/** Eje X categórico con el código de cada Gran Premio */
export function gpPointScale(gps: readonly GrandPrix[]) {
  return () => scalePoint<string>().domain(gps.map((gp) => gp.code)).padding(0.3);
}

/** Igual que gpPointScale pero con bandas, para poder dibujar barras que cuadren con las líneas */
export function gpBandScale(gps: readonly GrandPrix[]) {
  return () => scaleBand<string>().domain(gps.map((gp) => gp.code)).padding(0.2);
}

/** Código del GP -> nombre completo, para títulos de tooltip */
export function gpNameByCode(gps: readonly GrandPrix[]): Map<string, string> {
  return new Map(gps.map((gp) => [gp.code, gp.name]));
}
