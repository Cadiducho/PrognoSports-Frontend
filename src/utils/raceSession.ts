import dayjs from "dayjs";
import type {RaceSession} from "@/types/RaceSession";

// ToDo: i18n
const SESSION_HUMAN_NAMES: Record<string, string> = {
  RACE: "Carrera",
  QUALIFY: "Clasificación",
  SPRINT_QUALIFY: "Clasif. para Sprint",
  SPRINT_RACE: "Carrera Sprint",
};

/** Nombre de la sesión (code de la API) por el id con el que se identifica en las puntuaciones */
const SESSION_NAMES_BY_ID: Record<number, string> = {
  1: "QUALIFY",
  2: "RACE",
  3: "SPRINT_QUALIFY",
  4: "SPRINT_RACE",
};

/** Minutos antes de la sesión en los que se cierran los pronósticos */
const CLOSURE_MINUTES_BEFORE_SESSION = 5;

export function sessionHumanName(session: Pick<RaceSession, 'name'>): string {
  return SESSION_HUMAN_NAMES[session.name] ?? session.name;
}

/**
 * Nombre legible de una sesión a partir de su id, o undefined si el id no es de una sesión conocida
 */
export function sessionHumanNameById(id: number | string): string | undefined {
  const name = SESSION_NAMES_BY_ID[Number(id)];
  return name ? SESSION_HUMAN_NAMES[name] : undefined;
}

/**
 * Hora de cierre de un pronóstico. 5 minutos antes de la fecha de la sesión
 */
export function sessionClosureDate(session: Pick<RaceSession, 'date'>): Date {
  return dayjs(session.date).subtract(CLOSURE_MINUTES_BEFORE_SESSION, "minute").toDate();
}

/**
 * Verdadero si la fecha actual es anterior a la fecha de cierre del pronostico
 */
export function isBeforeSessionClosure(session: Pick<RaceSession, 'date'>): boolean {
  return dayjs().isBefore(sessionClosureDate(session));
}
