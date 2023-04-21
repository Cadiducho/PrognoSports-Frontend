/**
 * Clase con funciones utiles reunidas. Idílicamente, mucho de esto iría en cada clase (Circuit, UserRank...) en un paradigma orientado a objetos.
 * Por desgracia, cuando Axios crea estos objetos (sean interface o class), las funciones de las class retornan siempre undefined.
 * Para evitar tener varias funciones hasVariant o isAdmin definidas por todos los componentes,
 * se reunen aquí tomando como parámetro el objeto que debería tener la función
 */

import {Circuit} from "@/types/Circuit";
import {RaceSession} from "@/types/RaceSession";
import {RuleSet} from "@/types/RuleSet";

/**
 * Comprobar si un circuito tiene una variante válida y diferente a la por defecto, "grandprix"
 * @param circuit El circuito
 * @return True si es una variante válida y diferente
 */
export function hasVariant(circuit: Circuit): boolean {
    return circuit.variant !== undefined && circuit.variant.name !== "grandprix";
}