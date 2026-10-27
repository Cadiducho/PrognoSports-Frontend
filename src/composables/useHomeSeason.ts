import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import type { GrandPrix } from "@/types/GrandPrix";
import type { Season } from "@/types/Season";
import { grandPrixService, scoreService, seasonService } from "@/_services";
import { errorMessage } from "@/composables/errorMessage";
import { useCommunityStore } from "@/store/communityStore";
import type { PointsByGp } from "@/composables/charts/homeSeason";

/**
 * Carga de la temporada actual de la comunidad para la Home: Grandes Premios y puntos de todos los usuarios.
 * Es la misma llamada que usa el ranking, así que no añade peticiones nuevas. Se carga una vez y la comparten
 * todas las pestañas de gráficas.
 *
 * `season` se publica en cuanto se conoce (antes de tener los GPs y los puntos), para que lo que solo depende de
 * ella, como el resumen del usuario, no espere a lo más lento. Se vacía al empezar cada carga.
 */
export function useHomeSeason() {
  const communityStore = useCommunityStore();
  const { currentCommunity, thereIsCurrentCommunity } = storeToRefs(communityStore);

  const loading = ref(true);
  const season = ref<Season | null>(null);
  const grandPrixes = ref<GrandPrix[]>([]);
  const pointsByGp = ref<PointsByGp>({});

  // Evita que una respuesta lenta de una comunidad anterior pise a la actual
  let lastRequest = 0;

  async function load(): Promise<void> {
    const request = ++lastRequest;
    loading.value = true;
    season.value = null;

    if (!thereIsCurrentCommunity.value) {
      grandPrixes.value = [];
      pointsByGp.value = {};
      loading.value = false;
      return;
    }

    try {
      const community = currentCommunity.value;
      const currentSeason = await seasonService.getCurrentSeason(community.competition);
      if (request !== lastRequest) {
        return;
      }
      season.value = currentSeason;

      const [gpList, points] = await Promise.all([
        grandPrixService.getGrandPrixesList(currentSeason),
        scoreService.getUserPointsByGP(community, currentSeason),
      ]);

      if (request !== lastRequest) {
        return;
      }
      grandPrixes.value = gpList.filter((gp) => !gp.suspended);
      pointsByGp.value = points;
    } catch (error: unknown) {
      // Un usuario sin permisos sobre el ranking de la comunidad no es un error que mostrar
      if (!errorMessage(error)?.includes("Unauthorized")) {
        console.error(error);
      }
      if (request === lastRequest) {
        grandPrixes.value = [];
        pointsByGp.value = {};
      }
    } finally {
      if (request === lastRequest) {
        loading.value = false;
      }
    }
  }

  watch(currentCommunity, load, { immediate: true });

  return { loading, season, grandPrixes, pointsByGp, currentCommunity };
}
