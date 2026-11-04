import { ref, type Ref, watch } from "vue";
import { storeToRefs } from "pinia";
import type { Season } from "@/types/Season";
import type { UserResume } from "@/types/User";
import { userService } from "@/_services";
import type { ApiError } from "@/_services";
import { useAuthStore } from "@/store/authStore";
import { useCommunityStore } from "@/store/communityStore";

/**
 * Resumen del usuario en la comunidad actual (puntos y medias por sesión, GPs y sesiones ganadas).
 * Es el mismo dato que enseña el perfil, así que las cifras coinciden. Depende solo de `season`, que `useHomeSeason`
 * vacía al cambiar de comunidad y vuelve a publicar cuando conoce la nueva: así nunca se pide con la temporada vieja.
 */
export function useUserResume(season: Ref<Season | null>) {
  const { currentCommunity, thereIsCurrentCommunity } = storeToRefs(useCommunityStore());
  const authStore = useAuthStore();

  const resume = ref<UserResume | null>(null);

  // Evita que una respuesta lenta de una comunidad anterior pise a la actual
  let lastRequest = 0;

  async function load(): Promise<void> {
    const request = ++lastRequest;
    // Nunca se enseña el resumen de otra comunidad mientras llega el nuevo
    resume.value = null;

    if (!thereIsCurrentCommunity.value || !season.value) {
      return;
    }

    try {
      const community = currentCommunity.value;
      const response = await userService.getUserResume(authStore.requireUser(), community, community.competition, season.value);
      if (request === lastRequest) {
        resume.value = response;
      }
    } catch (error: unknown) {
      // Un usuario sin permisos sobre el ranking de la comunidad no es un error que mostrar
      if ((error as ApiError)?.status !== 403) {
        console.error(error);
      }
    }
  }

  watch(season, load, { immediate: true });

  return { resume };
}
