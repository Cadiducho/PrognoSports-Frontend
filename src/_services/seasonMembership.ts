import axios from "axios";
import {Season} from "@/types/Season";

/** Una entidad (piloto, constructor, GP) tal y como aparece dentro de una temporada */
export interface SeasonMembership<T> {
    season: Season;
    entry: T;
}

/**
 * Busca en qué temporadas aparece la entidad con `id`, consultando la lista de cada temporada en paralelo.
 * Las temporadas cuya lista falla se ignoran.
 *
 * TODO(Cadiducho/PrognoSports#241): sustituir por un endpoint del backend cuando exista.
 */
export async function findSeasonMemberships<T extends { id: number }>(
    listInSeason: (season: Season) => Promise<Array<T>>,
    id: number,
): Promise<Array<SeasonMembership<T>>> {
    const seasons: Array<Season> = await axios.get(`/seasons`);
    const lists = await Promise.allSettled(seasons.map(season => listInSeason(season)));

    const memberships: Array<SeasonMembership<T>> = [];
    lists.forEach((list, index) => {
        if (list.status !== "fulfilled") return;
        const entry = list.value.find(item => Number(item.id) === Number(id));
        if (entry) {
            memberships.push({season: seasons[index], entry});
        }
    });
    return memberships;
}

/** Compara textos ignorando mayúsculas y espacios en los extremos */
export function sameText(a: string | undefined, b: string | undefined): boolean {
    return (a ?? "").trim().toLowerCase() === (b ?? "").trim().toLowerCase();
}
