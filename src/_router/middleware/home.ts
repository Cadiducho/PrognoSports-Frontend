import {NavigationGuardNext, Route} from "vue-router";
import store from "@/_store";

export default function sendToHome(to: Route, from: Route, next: NavigationGuardNext) {
    // Si está iniciado sesión y entra a /, redirigir a /home
    const loggedIn = store.getters['Auth/isLoggedIn'];
    if (to.path === "/" && loggedIn) {
        next('/home');
    } else {
        next();
    }
}