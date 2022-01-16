import Vue from 'vue'
import VueRouter, {NavigationGuardNext, Route} from 'vue-router'
import store from '@/_store';
import LandingView from "@/views/landing/LandingView.vue";
Vue.use(VueRouter);

const routes = [

    // Landing, about y demás páginas genéricas
    {
        path: '/',
        component: LandingView,
        children: [
            {
                name: 'landing',
                path: '',
                component: () => import('@/components/landing/LandingHome.vue'),
            },
            {
                name: 'faq',
                path: '/faq',
                component: () => import('@/components/landing/FaqComponent.vue'),
            },
            {
                name: 'contact',
                path: '/contact',
                component: () => import('@/components/landing/ContactComponent.vue'),
            },
            {
                name: 'terms',
                path: '/terms',
                component: () => import('@/components/landing/TermsComponent.vue'),
            },
            {
                name: 'privacy',
                path: '/privacy',
                component: () => import('@/components/landing/PrivacyComponent.vue'),
            },
        ]
    },

    // Autentificación
    {
        path: '/login',
        component: LandingView,
        children: [{
            name: 'login',
            path: '',
            component: () => import('@/components/login/LoginComponent.vue'),
        }]
    },
    {
        path: '/logout',
        component: LandingView,
        children: [{
            name: 'lougout',
            path: '',
            component: () => import('@/components/login/LogoutComponent.vue'),
        }]
    },
    {
        path: '/register',
        component: LandingView,
        children: [{
            name: 'register',
            path: '',
            component: () => import('@/components/login/RegisterComponent.vue'),
        }]
    },
    {
        path: '/forgotpassword',
        component: LandingView,
        children: [{
            name: 'forgotpassword',
            path: '',
            component: () => import('@/components/login/ForgotPasswordComponent.vue'),
        }]
    },

    // Páginas de dentro de la aplicación iniciadas sesión
    {
        path: '/home',
        name: 'home',
        meta: { requiresAuth: true },
        component: () => import('@/views/home/Home.vue'),
    },

    // Admin
    {
        path: '/admin',
        name: 'admin',
        meta: { requiresAuth: true },
        component: () => import('@/views/admin/AdminPage.vue'),
    },
    {
        path: '/admin/drivers',
        name: 'adminDrivers',
        meta: { requiresAuth: true },
        component: () => import('@/views/admin/DriversAdmin.vue'),
    },
    {
        path: '/admin/constructors',
        name: 'adminConstructors',
        meta: { requiresAuth: true },
        component: () => import('@/views/admin/ConstructorsAdmin.vue'),
    },
    {
        path: '/admin/users',
        name: 'adminUsers',
        meta: { requiresAuth: true },
        component: () => import('@/views/admin/UsersAdmin.vue'),
    },
    {
        path: '/admin/competitions',
        name: 'adminCompetitions',
        meta: { requiresAuth: true },
        component: () => import('@/views/admin/competitions/CompetitionsList.vue'),
    },
    {
        path: '/admin/competitions/:competition',
        name: 'adminCompetitionEdit',
        meta: { requiresAuth: true },
        component: () => import('@/views/admin/competitions/CompetitionEdit.vue'),
    },
    {
        path: '/new/competition',
        name: 'competitionCreate',
        meta: { requiresAuth: true },
        component: () => import('@/views/admin/competitions/CompetitionCreate.vue'),
    },
    {
        path: '/admin/seasons',
        name: 'adminSeasons',
        meta: { requiresAuth: true },
        component: () => import('@/views/admin/seasons/SeasonsList.vue'),
    },
    {
        path: '/admin/seasons/:season',
        name: 'adminSeasonsEdit',
        meta: { requiresAuth: true },
        component: () => import('@/views/admin/seasons/SeasonEdit.vue'),
    },
    {
        path: '/new/season',
        name: 'seasonCreate',
        meta: { requiresAuth: true },
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
        meta: { requiresAuth: true },
        component: () => import('@/views/circuit/CreateCircuit.vue'),
    },
    {
        path: '/communities',
        name: 'communitiesList',
        meta: { requiresAuth: true },
        component: () => import('@/views/communities/ViewCommunitiesList.vue'),
    },
    {
        path: '/invitation/:community?/:code?',
        name: 'invitation',
        meta: { requiresAuth: true },
        component: () => import('@/views/communities/InvitationToCommunity.vue'),
    },
    {
        path: '/communities/:community',
        name: 'communitiesDetails',
        meta: { requiresAuth: true },
        component: () => import('@/views/communities/ViewOneCommunity.vue'),
    },
    {
        path: '/gps/:competition?/:season?',
        name: 'gplist',
        alias: ['/gps/:competition?', '/gps'],
        meta: { requiresAuth: true },
        component: () => import('@/views/gps/ViewGrandPrixList.vue'),
    },
    {
        path: '/gps/:competition/:season/:id',
        name: 'gpdetails',
        meta: { requiresAuth: true },
        component: () => import('@/views/gps/ViewOneGrandPrix.vue'),
    },
    {
        path: '/ranking',
        name: 'ranking',
        meta: { requiresAuth: true },
        component: () => import('@/views/ranking/Ranking.vue'),
    },
    {
        path: '/new/community',
        name: 'communitiesCreate',
        meta: { requiresAuth: true },
        component: () => import('@/views/communities/CreateCommunity.vue'),
    },
    {
        path: '/new/driver',
        name: 'driverCreate',
        meta: { requiresAuth: true },
        component: () => import('@/views/drivers/CreateDriver.vue'),
    },

    // Fallback
    {
        path: "/404",
        component: LandingView,
        children: [{
            name: 'Not Found',
            path: '',
            component: () => import('@/views/error/ErrorNotFound.vue'),
        }]
    },
    {
        path: '*',
        redirect: { path: "/404" }
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
    // Si está iniciado sesión y entra a /, redirigir a /home
    const loggedIn = store.getters['Auth/isLoggedIn'];
    if (to.path === "/" && loggedIn) {
        next('/home');
    } else {
        next();
    }
}

// Requerir login cuando sea necesario
function checkLoggedIn(to: Route, from: Route, next: NavigationGuardNext) {
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
