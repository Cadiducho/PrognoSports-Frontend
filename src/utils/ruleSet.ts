import type {RuleSet} from "@/types/RuleSet";
import type {RaceSession} from "@/types/RaceSession";

/**
 * Obtener la cantidad de posiciones a pronosticar para una comunidad y sesión de Gran Premio concreta
 * @param ruleSet Las reglas de la comunidad
 * @param session La sesión de Gran Premio
 */
export function ruleSetPredictedPositions(ruleSet: Pick<RuleSet, 'data'>, session: Pick<RaceSession, 'id'>): number {
  return ruleSet.data?.predictedPositions[session.id] || 0;
}
