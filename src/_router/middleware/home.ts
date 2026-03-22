import {RouteLocationNormalized} from "vue-router";
import {useAuthStore} from "@/store/authStore";

export default function sendToHome(to: RouteLocationNormalized) {
  const authStore = useAuthStore();

  // Si está iniciado sesión y entra a /, redirigir a /home
  const loggedIn = authStore.isLoggedIn;
  if (to.path === "/" && loggedIn) {
    return {
      path: '/home'
    };
  }

  return true;
}
