import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import type { RouteLocationRaw } from "vue-router";
import type { GrandPrix } from "@/types/GrandPrix";
import { fetchNextGrandPrix } from "@/composables/nextGrandPrixCache";
import { useCommunityStore } from "@/store/communityStore";
import {grandPrixLink} from "@/utils/grandPrix";

/** Lista de Grandes Premios: destino mientras carga o si no hay próximo GP */
const GP_LIST: RouteLocationRaw = { path: "/gps" };

/**
 * Enlace al próximo Gran Premio de la competición de la comunidad actual, para accesos directos globales.
 * Si aún no se sabe cuál es, o ya no queda ninguno esta temporada, enlaza con la lista de GPs.
 */
export function useNextGrandPrixLink() {
  const { currentCommunity, thereIsCurrentCommunity } = storeToRefs(useCommunityStore());

  const grandPrix = ref<GrandPrix | null>(null);

  // Evita que una respuesta lenta de una comunidad anterior pise a la actual
  let lastRequest = 0;

  async function load(): Promise<void> {
    const request = ++lastRequest;

    if (!thereIsCurrentCommunity.value) {
      grandPrix.value = null;
      return;
    }

    try {
      const gp = await fetchNextGrandPrix(currentCommunity.value.competition);
      if (request === lastRequest) {
        grandPrix.value = gp;
      }
    } catch {
      // Sin próximo GP la API responde con error: la lista de GPs sigue siendo un destino válido
      if (request === lastRequest) {
        grandPrix.value = null;
      }
    }
  }

  watch(currentCommunity, load, { immediate: true });

  const link = computed<RouteLocationRaw>(() => (grandPrix.value ? grandPrixLink(grandPrix.value) : GP_LIST));

  return { link };
}
