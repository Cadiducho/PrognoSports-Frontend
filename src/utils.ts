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
import {User} from "@/types/User";
import {RuleSet} from "@/types/RuleSet";

/**
 * Compara un {@link UserRank} para determinar si es administrador o no
 * @param user El rango a comparar
 * @return True si es administrador
 */
export function isAdmin(user: User): boolean {
    if (isValidUser(user)) {
        return user.rank.name.toLowerCase() === "admin";
    }
    return false;
}

/**
 * Obtener imagen de perfil de un usuario, o la de por defecto
 */
export function userProfileImage(user: User) {
    // ToDo: coger la imagen por defecto de los assets
    return user.profileImageUrl ?? 'https://github.com/Cadiducho/PrognoSports-Frontend/blob/develop/src/assets/default_profile_image.jpg?raw=true';
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
 * @param ruleSet La normas para este Gran Premio
 * @param session La sesión de Gran Premio
 */
export function cantidadPilotosPronosticados(ruleSet: RuleSet, session: RaceSession): number {
    return ruleSet?.data?.predictedPositions[session.name] || 0;
}

/**
 * Comprobar si el momento actual es anterior a la fecha de cierre de un Gran Premio en una sesión concreta
 * @param session La sesión
 * @return True si es antes del cierre de la sesión
 */
export function isBeforeEndDate(session: RaceSession): boolean {
    return dayjs().isBefore(session.date);
}

export function isValidCommunity(community: Community): boolean {
    return community.id !== 0;
}

export function isValidUser(user: User): boolean {
    return user.id !== 0;
}
