import type { Competition } from "@/types/Competition";
import type { GrandPrix } from "@/types/GrandPrix";
import { grandPrixService } from "@/_services";

// El próximo GP cambia como mucho una vez por fin de semana: unos minutos de caché bastan para que la barra móvil
// y el Inicio compartan la misma petición
const TTL = 5 * 60_000;

const entries = new Map<string, { at: number; promise: Promise<GrandPrix> }>();

/** Próximo Gran Premio de una competición. Las peticiones en curso o recientes se reutilizan; las fallidas no se guardan. */
export function fetchNextGrandPrix(competition: Competition): Promise<GrandPrix> {
  const key = competition.code;
  const hit = entries.get(key);
  if (hit && Date.now() - hit.at < TTL) {
    return hit.promise;
  }

  const promise = grandPrixService.getNextGrandPrix(competition);
  entries.set(key, { at: Date.now(), promise });
  promise.catch(() => {
    if (entries.get(key)?.promise === promise) {
      entries.delete(key);
    }
  });
  return promise;
}
