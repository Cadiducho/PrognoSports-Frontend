import {Season} from "@/types/Season";
import {errorMessage} from "@/composables/errorMessage";

/**
 * Una entidad (piloto, constructor, GP) tal y como aparece dentro de una temporada. Si sus datos en la
 * temporada no se han podido cargar, `entry` no existe y `error` explica por qué.
 */
export interface SeasonMembership<T> {
    season: Season;
    entry?: T;
    error?: string;
}

/**
 * Combina las temporadas de una entidad (`GET /{entidad}/{id}/seasons`) con sus datos en cada una
 * (dorsal, coche, ronda...), que se piden en paralelo. Una temporada cuyos datos fallen se mantiene,
 * con el error, para que no parezca que la entidad no está enlazada.
 */
export async function loadSeasonMemberships<T>(
    seasons: Array<Season>,
    fetchEntry: (season: Season) => Promise<T>,
): Promise<Array<SeasonMembership<T>>> {
    const entries = await Promise.allSettled(seasons.map(season => fetchEntry(season)));

    return entries.map((entry, index) => entry.status === "fulfilled"
        ? {season: seasons[index], entry: entry.value}
        : {season: seasons[index], error: errorMessage(entry.reason) ?? "No se han podido cargar sus datos en la temporada"});
}
