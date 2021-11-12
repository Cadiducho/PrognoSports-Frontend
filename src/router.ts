import Vue from 'vue'
import VueRouter, {NavigationGuardNext, Route} from 'vue-router'
import store from '@/_store';
Vue.use(VueRouter);

const routes = [

    // Landing
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

    // Admin
    {
        path: '/admin',
        name: 'admin',
        component: () => import('@/views/admin/AdminPage.vue'),
    },
    {
        path: '/admin/drivers',
        name: 'adminDrivers',
        component: () => import('@/views/admin/DriversAdmin.vue'),
    },
    {
        path: '/admin/constructors',
        name: 'adminConstructors',
        component: () => import('@/views/admin/ConstructorsAdmin.vue'),
    },
    {
        path: '/admin/users',
        name: 'adminUsers',
        component: () => import('@/views/admin/UsersAdmin.vue'),
    },
    {
        path: '/admin/competitions',
        name: 'adminCompetitions',
        component: () => import('@/views/admin/competitions/CompetitionsList.vue'),
    },
    {
        path: '/admin/competitions/:competition',
        name: 'adminCompetitionEdit',
        component: () => import('@/views/admin/competitions/CompetitionEdit.vue'),
    },
    {
        path: '/new/competition',
        name: 'competitionCreate',
        component: () => import('@/views/admin/competitions/CompetitionCreate.vue'),
    },
    {
        path: '/admin/seasons',
        name: 'adminSeasons',
        component: () => import('@/views/admin/seasons/SeasonsList.vue'),
    },
    {
        path: '/admin/seasons/:season',
        name: 'adminSeasonsEdit',
        component: () => import('@/views/admin/seasons/SeasonEdit.vue'),
    },
    {
        path: '/new/season',
        name: 'seasonCreate',
        component: () => import('@/views/admin/seasons/SeasonCreate.vue'),
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
        path: '/new/circuit',
        name: 'circuitCreate',
        component: () => import('@/views/circuit/CreateCircuit.vue'),
    },
    {
        path: '/communities',
        name: 'communitiesList',
        component: () => import('@/views/communities/ViewCommunitiesList.vue'),
    },
    {
        path: '/invitation/:community?/:code?',
        name: 'invitation',
        component: () => import('@/views/communities/InvitationToCommunity.vue'),
    },
    {
        path: '/communities/:community',
        name: 'communitiesDetails',
        component: () => import('@/views/communities/ViewOneCommunity.vue'),
    },
    {
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
        path: '/new/community',
        name: 'communitiesCreate',
        component: () => import('@/views/communities/CreateCommunity.vue'),
    },
    {
        path: '/new/driver',
        name: 'driverCreate',
        component: () => import('@/views/drivers/CreateDriver.vue'),
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
    checkLoggedIn(to, from, next);
    checkCommunity(to, from, next);
    sendToHome(to, from, next);
});

function sendToHome(to: Route, from: Route, next: NavigationGuardNext) {
    const loggedIn = store.getters['Auth/isLoggedIn'];
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
        const loggedIn = store.getters['Auth/isLoggedIn'];
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
