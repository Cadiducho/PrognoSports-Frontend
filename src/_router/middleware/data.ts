import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";

export default function fetchDataFromClient() {
  const authStore = useAuthStore();
  const communityStore = useCommunityStore();

  return authStore.userRequest()
    .then(() => {
      const loggedIn = authStore.isLoggedIn;
      //console.log("[🍍] Logged in? " + loggedIn)
      if (!loggedIn) {
        return true;
      }

      // Si existe usuario iniciado sesión, pido su comunidad
      const hasCommunity = communityStore.thereIsCurrentCommunity;
      const user = authStore.loggedUser;
      if (!hasCommunity) {
        const storedCommunityId = communityStore.storedCommunityId;
        const checkForId = storedCommunityId ?? user.currentCommunity?.id;
        // Tenga o no comunidad, se intenta pedir; el flujo sigue igualmente.
        return communityStore.communityRequest({communityId: checkForId})
          .catch(() => undefined)
          .then(() => true);
      }

      return true;
    })
    .catch(() => {
      // Si falla la carga inicial, no se bloquea la navegación.
      return true;
    });
}
