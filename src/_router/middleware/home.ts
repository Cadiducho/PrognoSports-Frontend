import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import {useAuthStore} from "@/store/authStore";

export default function sendToHome(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    const authStore = useAuthStore();

    // Si está iniciado sesión y entra a /, redirigir a /home
    const loggedIn = authStore.isLoggedIn;
    if (to.path === "/" && loggedIn) {
        next('/home');
    } else {
        next();
    }
}