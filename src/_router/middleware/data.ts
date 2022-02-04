import {NavigationGuardNext, Route} from "vue-router";
import store from "@/_store";

export default function fetchDataFromClient(to: Route, from: Route, next: NavigationGuardNext) {
    store.dispatch('Auth/userRequest').finally(() => {
        const loggedIn = store.getters['Auth/isLoggedIn'];
        if (loggedIn) {
            // Si existe usuario iniciado sesión, pido su comunidad
            const hasCommunity = store.getters['Auth/thereIsCurrentCommunity'];
            const user = store.getters['Auth/loggedUser'];
            if (!hasCommunity) {
                const storedCommunityId = store.getters['Auth/storedCommunityId'];
                let checkForId = storedCommunityId ?? user.currentCommunity?.id;
                store.dispatch('Auth/communityRequest', {communityId: checkForId}).finally(() => {
                    // Tenga o no comunidad, se ha pedido, next y se encarga otro middleware
                    next();
                })
            } else {
                // tiene comunidad, next
                next();
            }
        } else {
            // Si no existe usuario, paso al siguiente middleware
            next();
        }
    });
}