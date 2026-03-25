import {RouteLocationNormalized} from "vue-router";
import {useAuthStore} from "@/store/authStore";

// Asegurar que el usuario está verificado, si no mandar a la página para verificar su email
export default function checkUserIsVerified(to: RouteLocationNormalized) {
  const authStore = useAuthStore();

  if (to.matched.some(record => record.meta.requiresAuth) && !authStore.loggedUser.isVerified() && to.name !== 'verify') {
    return {
      name: 'verify',
      query: { redirect: to.fullPath }
    };
  }

  return true;
}
