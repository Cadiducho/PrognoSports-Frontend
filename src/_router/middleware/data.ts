import {NavigationGuardNext, RouteLocationNormalized} from "vue-router";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";

export default function fetchDataFromClient(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    const authStore = useAuthStore();
    const communityStore = useCommunityStore();
    authStore.userRequest().finally(() => {
        const loggedIn = authStore.isLoggedIn;
        //console.log("[🍍] Logged in? " + loggedIn)
        if (loggedIn) {
            // Si existe usuario iniciado sesión, pido su comunidad
            const hasCommunity = communityStore.thereIsCurrentCommunity;
            const user = authStore.loggedUser;
            if (!hasCommunity) {
                const storedCommunityId = communityStore.storedCommunityId;
                let checkForId = storedCommunityId ?? user.currentCommunity?.id;
                communityStore.communityRequest({communityId: checkForId}).finally(() => {
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