import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";

/**
 * Carga el usuario con la sesión iniciada y su comunidad. El usuario solo se pide la primera vez (o tras cambiar sus
 * datos, ver authStore.loadUser), no en cada navegación.
 */
export default async function fetchDataFromClient() {
  const authStore = useAuthStore();
  const communityStore = useCommunityStore();

  try {
    const user = await authStore.loadUser();
    if (!user) {
      return true;
    }

    communityStore.initFromUser(user);

    // Si hay usuario pero aún no se ha cargado su comunidad, se pide. Tenga o no comunidad, el flujo sigue igualmente.
    const storedCommunityId = communityStore.storedCommunityId;
    if (!communityStore.thereIsCurrentCommunity && storedCommunityId > 0) {
      await communityStore.communityRequest({communityId: storedCommunityId}).catch(() => undefined);
    }
  } catch {
    // Si falla la carga inicial, no se bloquea la navegación.
  }

  return true;
}
