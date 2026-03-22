import {RouteLocationNormalized} from "vue-router";
import {useCommunityStore} from "@/store/communityStore";

// Asegurar que el usuario está en una comunidad si esa ruta lo requiere
export default function checkCommunity(to: RouteLocationNormalized) {
  const communityStore = useCommunityStore();
  if (to.matched.some(record => record.meta.requiresCommunity)) {
    // Si no tiene comunidad pero la ruta lo requiere, mandar a /communities
    const hasCommunity = communityStore.thereIsCurrentCommunity;
    if (!hasCommunity) {
      return {
        path: '/communities'
      };
    }
  }

  return true;
}
