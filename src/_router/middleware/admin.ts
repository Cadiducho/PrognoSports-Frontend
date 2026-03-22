import {RouteLocationNormalized} from "vue-router";
import {useAuthStore} from "@/store/authStore";

// Asegurar que el usuario es un admin si va a visitar una pagina de administración
export default function checkIsAdmin(to: RouteLocationNormalized) {
  const authStore = useAuthStore();

  if (to.matched.some(record => record.meta.requiresAdmin)) {
    // Si no es admin mostrar un 404
    const user = authStore.loggedUser;

    if (!user.isAdmin()) {
      return {
        path: '/404'
      };
    }
  }

  return true;
}
