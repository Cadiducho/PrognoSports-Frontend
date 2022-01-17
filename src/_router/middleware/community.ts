import {NavigationGuardNext, Route} from "vue-router";
import store from "@/_store";

// Asegurar que el usuario está en una comunidad si esa ruta lo requiere
export default function checkCommunity(to: Route, from: Route, next: NavigationGuardNext) {
    if (!to.name?.startsWith('/gps') && !to.name?.startsWith('/ranking') && !to.name?.startsWith('/rules')) {
        // Si no es ninguna de estas rutas, no hacer nada
        next();
    } else {
        const hasCommunity = store.getters['Auth/thereIsCurrentCommunity'];
        if (!hasCommunity) {
            // Si es una de esas rutas que necesitan comunidad, y no la tiene, mandar a /communities
            next('/communities');
        } else {
            next();
        }
    }
}