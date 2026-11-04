import {Season} from "@/types/Season";

/**
 * Una entidad (piloto, constructor, GP) tal y como aparece dentro de una temporada, con sus datos en ella
 * (dorsal, coche, ronda...). Es lo que devuelven `GET /{drivers|constructors|gps}/{id}/seasons`.
 * Si sus datos no se han podido cargar, `entry` no existe y `error` explica por qué.
 */
export interface SeasonMembership<T> {
    season: Season;
    entry?: T;
    error?: string;
}
