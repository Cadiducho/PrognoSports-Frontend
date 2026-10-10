import { User } from "@/types/User";
import { UserPoints } from "@/types/UserPoints";

export interface TableEntry {
  user: User;
  gps: Map<number, UserPoints>;
  totalScore: number;
}

/** Un punto de una línea del ranking. `value` null deja un hueco en la línea. */
export interface RankingLinePoint {
  gpCode: string;
  gpName: string;
  username: string;
  value: number | null;
  /** Valor sin transformar cuando `value` es una diferencia (vistas de acumulado respecto al líder o a ti) */
  total?: number | null;
}

/** Tramo de aciertos respecto al máximo del Gran Premio */
export type HitsLevel = "none" | "zero" | "low" | "mid" | "high" | "max";

export interface RankingHitsCell {
  gpCode: string;
  gpName: string;
  username: string;
  hits: number;
  maxHits: number;
  participated: boolean;
  level: HitsLevel;
}
