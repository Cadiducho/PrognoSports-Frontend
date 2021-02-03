/**
 * Clase con funciones utiles reunidas. Idílicamente, mucho de esto iría en cada clase (Circuit, UserRank...) en un paradigma orientado a objetos.
 * Por desgracia, cuando Axios crea estos objetos (sean interface o class), las funciones de las class retornan siempre undefined.
 * Para evitar tener varias funciones hasVariant o isAdmin definidas por todos los componentes,
 * se reunen aquí tomando como parámetro el objeto que debería tener la función
 */

import {UserRank} from "@/types/UserRank";
import {Circuit} from "@/types/Circuit";

export function isAdmin(rank: UserRank): boolean {
    return rank.name.toLowerCase() === "admin";
}

export function hasVariant(circuit: Circuit): boolean {
    return circuit.variant.name !== "grandprix";
}