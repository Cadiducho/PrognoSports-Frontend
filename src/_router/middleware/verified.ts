import {RouteLocationNormalized} from "vue-router";
import {useAuthStore} from "@/store/authStore";
import {isUserVerified} from "@/utils/user";

// Asegurar que el usuario está verificado, si no mandar a la página para verificar su email
export default function checkUserIsVerified(to: RouteLocationNormalized) {
  const authStore = useAuthStore();

  if (to.matched.some(record => record.meta.requiresAuth) && !isUserVerified(authStore.loggedUser) && to.name !== 'verify') {
    return {
      name: 'verify',
      query: { redirect: to.fullPath }
    };
  }

  return true;
}
