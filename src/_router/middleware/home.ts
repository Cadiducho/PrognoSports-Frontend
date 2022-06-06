import {NavigationGuardNext, Route} from "vue-router";
import {useAuthStore} from "@/pinia/authStore";

export default function sendToHome(to: Route, from: Route, next: NavigationGuardNext) {
    const authStore = useAuthStore();

    // Si está iniciado sesión y entra a /, redirigir a /home
    const loggedIn = authStore.isLoggedIn;
    if (to.path === "/" && loggedIn) {
        next('/home');
    } else {
        next();
    }
}