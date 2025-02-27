import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import {useCommunityStore} from "@/store/communityStore";

// Asegurar que el usuario está en una comunidad si esa ruta lo requiere
export default function checkCommunity(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  const communityStore = useCommunityStore();
  if (to.matched.some(record => record.meta.requiresCommunity)) {
    console.log('la ruta requiere comunidad', to)
    // Si no tiene comunidad pero la ruta lo requiere, mandar a /communities
    const hasCommunity = communityStore.thereIsCurrentCommunity;
    if (!hasCommunity) {
      console.log('el usuario no tiene comunidad')
      next({
        path: '/communities'
      });
    } else {
      console.log('el usuario tiene comunidad')
      next();
    }
  } else {
    console.log('la ruta no requiere comunidad', to)
    next();
  }
}
