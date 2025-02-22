import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import {useAuthStore} from "@/store/authStore";

// Asegurar que el usuario está verificado, si no mandar a la página para verificar su email
export default function checkUserIsVerified(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  const authStore = useAuthStore();

  if (to.matched.some(record => record.meta.requiresAuth) && !authStore.loggedUser.isVerified() && to.name !== 'verify') {
    next({ name: 'verify' });
  } else {
    next();
  }
}
