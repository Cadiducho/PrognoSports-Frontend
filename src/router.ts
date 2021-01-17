import Vue from 'vue'
import VueRouter, {NavigationGuardNext, Route} from 'vue-router'
import {AuthModule} from "@/_store/modules/AuthModule";
import {CommunityModule} from "@/_store/modules/CommunityModule";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'landing',
        component: () => import('@/views/landing/Landing.vue'),
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/Home.vue'),
    },
    {
        path: '/circuits',
        name: 'circuitlist',
        component: () => import('@/views/circuit/ViewCircuitList.vue'),
    },
    {
        path: '/circuits/:circuit/:variant?',
        name: 'circuitDetails',
        component: () => import('@/views/circuit/ViewOneCircuit.vue'),
    },
    {
        path: '/communities',
        name: 'communitiesList',
        component: () => import('@/views/communities/ViewCommunitiesList.vue'),
    },
        path: '/gps/:competition?/:season?',
        name: 'gplist',
        alias: ['/gps/:competition?', '/gps'],
        component: () => import('@/views/gps/ViewGrandPrixList.vue'),
    },
    {
        path: '/gps/:competition/:season/:id',
        name: 'gpdetails',
        component: () => import('@/views/gps/ViewOneGrandPrix.vue'),
    },
    {
        path: '/ranking',
        name: 'ranking',
        component: () => import('@/views/ranking/Ranking.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/Login.vue'),
    },
    {
        path: '/logout',
        name: 'lougout',
        component: () => import('@/views/login/Logout.vue'),
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/login/Register.vue'),
    },
    {
        path: '/forgotpassword',
        name: 'forgotpassword',
        component: () => import('@/views/login/ForgotPassword.vue'),
    },
    {
        path: '*',
        component: () => import('@/views/error/ErrorNotFound.vue')
    }
];

export const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

// Si está iniciado sesión y va a /, mandar a /home
router.beforeEach((to, from, next) => {
    sendToHome(to, from, next);
    checkLoggedIn(to, from, next);
    checkCommunity(to, from, next);
});

function sendToHome(to: Route, from: Route, next: NavigationGuardNext) {
    const loggedIn = AuthModule.isAuthenticated;
    if (to.path === "/" && loggedIn) {
        next('/home');
    } else {
        next();
    }
}

// Requerir login cuando sea necesario
function checkLoggedIn(to: Route, from: Route, next: NavigationGuardNext) {
    if (!to.name?.startsWith('/gps') && !to.name?.startsWith('/u')
        && !to.name?.startsWith('/invitation') && !to.name?.startsWith('/settings')
        && !to.name?.startsWith('/communities')) {
        // Si no es ninguna de estas rutas 'privadas', no hacer nada
        next();
    } else {
        const loggedIn = AuthModule.isAuthenticated;
        if (!loggedIn) {
            // Si es una de esas rutas 'privadas' y no está logged, mandar a /login
            next('/login');
        } else {
            next();
        }
    }
}

// Asegurar que el usuario está en una comunidad si esa ruta lo requiere
function checkCommunity(to: Route, from: Route, next: NavigationGuardNext) {
    if (!to.name?.startsWith('/gps') && !to.name?.startsWith('/ranking') && !to.name?.startsWith('/rules')) {
        // Si no es ninguna de estas rutas, no hacer nada
        console.log()
        next();
    } else {
        const hasCommunity = CommunityModule.thereIsCurrentCommunity;
        if (!hasCommunity) {
            // Si es una de esas rutas que necesitan comunidad, y no la tiene, mandar a /communities
            next('/communities');
        } else {
            next();
        }
    }
}
