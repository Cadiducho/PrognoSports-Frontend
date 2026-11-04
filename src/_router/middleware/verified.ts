import {RouteLocationNormalized} from "vue-router";
import {useAuthStore} from "@/store/authStore";
import {isUserVerified} from "@/utils/user";

// Asegurar que el usuario está verificado, si no mandar a la página para verificar su email
export default function checkUserIsVerified(to: RouteLocationNormalized) {
  const authStore = useAuthStore();
  const user = authStore.loggedUser;

  if (to.matched.some(record => record.meta.requiresAuth) && user && !isUserVerified(user) && to.name !== 'verify') {
    return {
      name: 'verify',
      query: { redirect: to.fullPath }
    };
  }

  return true;
}
