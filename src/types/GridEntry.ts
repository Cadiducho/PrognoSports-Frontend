import {Driver} from "@/types/Driver";

/**
 * Un piloto en la parrilla que se está editando. Su posición es el orden en la lista, no un campo
 */
export interface GridEntry {
    driver: Driver;
    isFromPit: boolean;
    note: string;
}

/** Longitud máxima de la nota de un piloto en la parrilla (la misma que valida la API) */
export const GRID_NOTE_MAX_LENGTH = 120;

/** Motivos habituales que se anteponen a la nota */
export const GRID_NOTE_REASONS = [
    'Impeding',
    'Caja de cambios',
    'Unidad de potencia',
    'Cambio en parque cerrado',
    'Incidente en la sesión anterior',
];

/** Las sanciones en posiciones quedan escritas al principio de la nota: "Sanción de 4 posiciones" */
export const GRID_PENALTY_PATTERN = /^Sanción de (\d+) posiciones?/i;

/** Texto de la nota para una sanción de `places` posiciones o de final de parrilla */
export function gridPenaltyText(places: number, toTheBack = false): string {
    return toTheBack ? 'Sanción de final de parrilla' : `Sanción de ${places} ${places === 1 ? 'posición' : 'posiciones'}`;
}

/** Sanción anotada en la nota de un piloto, para etiquetarla en la lista */
export function gridPenaltyLabel(note: string): string | undefined {
    const match = GRID_PENALTY_PATTERN.exec(note);
    if (match) {
        return `Sanción +${match[1]}`;
    }
    return /^Sanción de final de parrilla/i.test(note) ? 'Sanción final' : undefined;
}

/** Posiciones de la sanción anotada en una nota, o 'back' si es de final de parrilla */
export function gridPenaltyPlaces(note: string): number | 'back' | undefined {
    const match = GRID_PENALTY_PATTERN.exec(note);
    if (match) {
        return Number(match[1]);
    }
    return /^Sanción de final de parrilla/i.test(note) ? 'back' : undefined;
}
