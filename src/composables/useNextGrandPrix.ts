import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useIntervalFn, useNow } from "@vueuse/core";
import type { GrandPrix } from "@/types/GrandPrix";
import type { RaceSession } from "@/types/RaceSession";
import { grandPrixService } from "@/_services";
import { errorMessage } from "@/composables/errorMessage";
import { fetchNextGrandPrix } from "@/composables/nextGrandPrixCache";
import { useAuthStore } from "@/store/authStore";
import { useCommunityStore } from "@/store/communityStore";
import {sessionClosureDate} from "@/utils/raceSession";

/** `closing`: abierta y se cierra en menos de 24 horas */
export type SessionStatus = "done" | "closing" | "pending" | "closed";

export interface NextGrandPrixSession {
  session: RaceSession;
  /** El usuario ya tiene pronóstico en esta sesión */
  done: boolean;
  status: SessionStatus;
  /** Ya no admite cambios, tenga o no pronóstico */
  closed: boolean;
  /** Texto corto hasta el cierre: «2 días», «15 h», «40 min» */
  closesIn: string;
}

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function countdownParts(target: Date, now: Date): CountdownParts {
  const left = Math.max(target.getTime() - now.getTime(), 0);
  return {
    days: Math.floor(left / DAY),
    hours: Math.floor((left % DAY) / HOUR),
    minutes: Math.floor((left % HOUR) / MINUTE),
  };
}

export function countdownText(target: Date, now: Date): string {
  const { days, hours, minutes } = countdownParts(target, now);
  if (days >= 1) {
    return `${days} ${days === 1 ? "día" : "días"}`;
  }
  return hours >= 1 ? `${hours} h` : `${Math.max(minutes, 1)} min`;
}

export function sessionStatus(session: RaceSession, done: boolean, now: Date): SessionStatus {
  const closure = sessionClosureDate(session);
  if (done) {
    return "done";
  }
  if (closure <= now) {
    return "closed";
  }
  return closure.getTime() - now.getTime() < DAY ? "closing" : "pending";
}

/**
 * Próximo Gran Premio de la comunidad y, para cada una de sus sesiones, si el usuario ya ha pronosticado.
 * Se vuelve a pedir al cambiar de comunidad; `now` se actualiza cada 30 s para que cambien los estados y las cuentas atrás.
 */
export function useNextGrandPrix() {
  const { currentCommunity, thereIsCurrentCommunity } = storeToRefs(useCommunityStore());
  const authStore = useAuthStore();
  const now = useNow({ scheduler: (callback) => useIntervalFn(callback, 30_000) });

  const loading = ref(true);
  const grandPrix = ref<GrandPrix | null>(null);
  const tipped = ref<Record<number, boolean>>({});
  /** No se pudo hablar con el servidor: distinto de que ya no queden Grandes Premios */
  const failed = ref(false);

  // Evita que una respuesta lenta de una comunidad anterior pise a la actual
  let lastRequest = 0;

  async function load(): Promise<void> {
    const request = ++lastRequest;
    loading.value = true;
    failed.value = false;

    if (!thereIsCurrentCommunity.value) {
      grandPrix.value = null;
      tipped.value = {};
      loading.value = false;
      return;
    }

    try {
      const community = currentCommunity.value;
      const user = authStore.requireUser();
      const gp = await fetchNextGrandPrix(community.competition);
      const sessions = [...(gp.sessions ?? [])].sort((a, b) => a.date.getTime() - b.date.getTime());

      // Un fallo al pedir los pronósticos de una sesión no debe esconder las demás: se cuenta como no hecha
      const results = await Promise.allSettled(
        sessions.map((session) => grandPrixService.getUserTipps(gp, session, community, user)),
      );
      const done: Record<number, boolean> = {};
      sessions.forEach((session, index) => {
        const result = results[index]!;
        // Si hay pronóstico, `driver` está definido; si no, la entrada llega vacía (misma regla que SelectTipps)
        done[session.id] = result.status === "fulfilled"
          && Object.values(result.value ?? {}).some((tipp) => tipp?.driver != undefined);
      });

      if (request !== lastRequest) {
        return;
      }
      grandPrix.value = gp;
      tipped.value = done;
    } catch (error: unknown) {
      if (request === lastRequest) {
        grandPrix.value = null;
        tipped.value = {};
        // Sin próximo GP (temporada terminada) la API responde con un mensaje de error: es un caso normal. Sin mensaje
        // no hubo respuesta del servidor, y eso sí se avisa
        failed.value = errorMessage(error) === undefined;
      }
      if (errorMessage(error) === undefined) {
        console.error(error);
      }
    } finally {
      if (request === lastRequest) {
        loading.value = false;
      }
    }
  }

  watch(currentCommunity, load, { immediate: true });

  const sessions = computed<NextGrandPrixSession[]>(() => {
    const sorted = [...(grandPrix.value?.sessions ?? [])].sort((a, b) => a.date.getTime() - b.date.getTime());
    return sorted.map((session) => {
      const done = tipped.value[session.id] === true;
      return {
        session,
        done,
        status: sessionStatus(session, done, now.value),
        closed: sessionClosureDate(session) <= now.value,
        closesIn: countdownText(sessionClosureDate(session), now.value),
      };
    });
  });

  /** La primera sesión que sigue abierta: la que se cuenta atrás */
  const nextClosure = computed(() => sessions.value.find((row) => !row.closed) ?? null);
  const doneCount = computed(() => sessions.value.filter((row) => row.done).length);

  return { loading, failed, grandPrix, sessions, nextClosure, doneCount, now };
}
