/**
 * Clase con funciones utiles reunidas. Idílicamente, mucho de esto iría en cada clase (Circuit, UserRank...) en un paradigma orientado a objetos.
 * Por desgracia, cuando Axios crea estos objetos (sean interface o class), las funciones de las class retornan siempre undefined.
 * Para evitar tener varias funciones hasVariant o isAdmin definidas por todos los componentes,
 * se reunen aquí tomando como parámetro el objeto que debería tener la función
 */

import {UserRank} from "@/types/UserRank";
import {Circuit} from "@/types/Circuit";
import {Community} from "@/types/Community";
import {RaceSession} from "@/types/RaceSession";
import dayjs from "dayjs";
import {GrandPrix} from "@/types/GrandPrix";

/**
 * Compara un {@link UserRank} para determinar si es administrador o no
 * @param rank El rango a comparar
 * @return True si es administrador
 */
export function isAdmin(rank: UserRank): boolean {
    return rank.name.toLowerCase() === "admin";
}

/**
 * Comprobar si un circuito tiene una variante válida y diferente a la por defecto, "grandprix"
 * @param circuit El circuito
 * @return True si es una variante válida y diferente
 */
export function hasVariant(circuit: Circuit): boolean {
    return circuit.variant !== undefined && circuit.variant.name !== "grandprix";
}

/**
 * Obtener la cantidad de posiciones a pronosticar para una comunidad y sesión de Gran Premio concreta
 * @param currentCommunity La comunidad
 * @param session La sesión de Gran Premio
 */
export function cantidadPilotosPronosticados(currentCommunity: Community, session: RaceSession): number {
    switch (session) {
        case RaceSession.QUALIFY:
            return currentCommunity.qualify_positions_predicted;
        case RaceSession.RACE:
            return currentCommunity.race_positions_predicted;
    }
    return 0;
}

/**
 * Comprobar si el momento actual es anterior a la fecha de cierre de un Gran Premio en una sesión concreta
 * @param grandPrix El gran premio
 * @param session La sesión
 * @return True si es antes del cierre de la sesión
 */
export function isBeforeEndDate(grandPrix: GrandPrix, session: RaceSession): boolean {
    if (session === "QUALIFY") {
        return dayjs().isBefore(grandPrix.qualiTime);
    } else {
        return dayjs().isBefore(grandPrix.raceTime);
    }
}