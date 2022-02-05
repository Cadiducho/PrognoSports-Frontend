import {NavigationGuardNext, Route} from "vue-router";
import store from "@/_store";

// Asegurar que el usuario está en una comunidad si esa ruta lo requiere
export default function checkCommunity(to: Route, from: Route, next: NavigationGuardNext) {
    if (to.matched.some(record => record.meta.requiresCommunity)) {
        // Si no está logged in y la ruta lo requiere, mandar al login
        let hasCommunity = store.getters['Auth/thereIsCurrentCommunity'];
        if (!hasCommunity) {
            next({
                path: '/communities'
            });
        } else {
            next();
        }
    } else {
        next();
    }
}