import {NavigationGuardNext, Route} from "vue-router";
import store from "@/_store";

// Requerir login cuando sea necesario
export default function checkLoggedIn(to: Route, from: Route, next: NavigationGuardNext) {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // Si no está logged in y la ruta lo requiere, mandar al login
        const loggedIn = store.getters['Auth/isLoggedIn'];
        if (!loggedIn) {
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            })
        } else {
            next();
        }
    } else {
        next();
    }
}