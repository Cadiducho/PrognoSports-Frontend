import {RouteLocationNormalized} from "vue-router";
import {useAuthStore} from "@/store/authStore";

// Requerir login cuando sea necesario
export default function checkLoggedIn(to: RouteLocationNormalized) {
  const authStore = useAuthStore();

  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Si no está logged in y la ruta lo requiere, mandar al login
    const loggedIn = authStore.isLoggedIn;
    if (!loggedIn) {
      return {
        path: '/login',
        query: {redirect: to.fullPath}
      };
    }
  }

  return true;
}
