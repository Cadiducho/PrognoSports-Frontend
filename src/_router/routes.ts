import LandingView from "@/views/LandingView.vue";
import PrognoView from "@/views/PrognoView.vue";
import EmptyRoutedView from "@/views/EmptyRoutedView.vue";

export const routes = [

    // Landing, about y demás páginas genéricas
    {
        path: '/',
        component: LandingView,
        children: [
            {
                name: 'landing',
                alias: ['/landing'],
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
            {
                name: 'rules',
                path: '/rules',
                component: () => import('@/components/landing/RulesComponent.vue'),
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
        meta: { requiresAuth: true, requiresCommunity: true },
        component: PrognoView,
        children: [{
            path: '',
            name: 'home',
            component: () => import('@/components/home/HomeComponent.vue'),
            meta: { title: "Inicio" }
        }]
    },
    {
        path: '/user/:user?',
        alias: ['/u/:user?'],
        meta: { requiresAuth: true, requiresCommunity: true, title: "Usuarios" },
        component: PrognoView,
        children: [{
            path: '',
            name: 'user',
            component: () => import('@/components/user/UserProfile.vue'),
            meta: { title: "Usuario" }
        }]
    },

    // Admin
    {
        path: '/admin',
        meta: { requiresAuth: true, title: "Admin" },
        component: PrognoView,
        children: [
            {
                path: '',
                name: 'admin',
                component: () => import('@/components/admin/AdminPage.vue'),
            },
            {
                path: 'drivers',
                name: 'adminDrivers',
                component: () => import('@/components/admin/driver/DriversAdmin.vue'),
                meta: { title: "Pilotos" }
            },
            {
                path: 'constructors',
                name: 'adminConstructors',
                component: () => import('@/components/admin/ConstructorsAdmin.vue'),
                meta: { title: "Constructores" }
            },
            {
                path: 'users',
                name: 'adminUsers',
                component: () => import('@/components/admin/UsersAdmin.vue'),
                meta: { title: "Usuarios" }
            },
            {
                path: 'competitions',
                name: 'adminCompetitions',
                component: EmptyRoutedView,
                meta: { title: "Competiciones" },
                children: [
                    {
                        path: '',
                        component: () => import('@/components/admin/competitions/CompetitionsList.vue'),
                    },
                    {
                        path: ':competition',
                        name: 'adminCompetitionEdit',
                        component: () => import('@/components/admin/competitions/CompetitionEdit.vue'),
                        meta: { title: "Editar competición" }
                    },
                ],
            },
            {
                path: 'gps',
                component: EmptyRoutedView,
                meta: { title: "Grandes Premios" },
                children: [
                    {
                        path: '',
                        name: 'adminGps',
                        component: () => import('@/components/admin/gps/GrandPrixList.vue'),
                    },
                    {
                        path: ':competition/:season/:id',
                        component: EmptyRoutedView,
                        meta: { title: "Gran Premio" },
                        children: [
                            {
                                path: '',
                                name: 'adminGpEdit',
                                meta: { title: "Editar Gran Premio" },
                                component: () => import('@/components/admin/gps/edit/GrandPrixEditPage.vue'),
                            },
                        ]
                    },
                ],
            },
            {
                path: 'seasons',
                component: EmptyRoutedView,
                meta: { title: "Temporadas" },
                children: [
                    {
                        path: '',
                        name: 'adminSeasons',
                        component: () => import('@/components/admin/seasons/SeasonsList.vue'),
                    },
                    {
                        path: ':season',
                        name: 'adminSeasonsEdit',
                        component: () => import('@/components/admin/seasons/SeasonEdit.vue'),
                        meta: { title: "Editar temporada" }
                    },
                ],
            },
            {
                path: 'sessions',
                name: 'adminSessions',
                component: () => import('@/components/admin/sessions/SessionList.vue'),
                meta: { title: "Sesiones" },
            },
        ]
    },

    // Creaciones de objetos / news
    {
        path: '/new',
        meta: {requiresAuth: true},
        component: PrognoView,
        children: [
            {
                path: 'competition',
                name: 'competitionCreate',
                component: () => import('@/components/admin/competitions/CompetitionCreate.vue'),
                meta: { title: "Nueva competición" }
            },
            {
                path: 'season',
                name: 'seasonCreate',
                component: () => import('@/components/admin/seasons/SeasonCreate.vue'),
                meta: { title: "Nueva temporada" }
            },
            {
                path: 'circuit',
                name: 'circuitCreate',
                component: () => import('@/components/admin/circuit/CreateCircuit.vue'),
                meta: { title: "Nuevo circuito" }
            },
            {
                path: 'community',
                name: 'communitiesCreate',
                component: () => import('@/components/communities/CreateCommunity.vue'),
                meta: { title: "Nueva comunidad" }
            },
            {
                path: 'driver',
                name: 'driverCreate',
                component: () => import('@/components/admin/driver/CreateDriver.vue'),
                meta: { title: "Nuevo piloto" }
            },
            {
                path: 'grandprix',
                name: 'gpCreate',
                component: () => import('@/components/admin/gps/GrandPrixCreate.vue'),
                meta: { title: "Nuevo gran premio" }
            },
        ]
    },

    // Circuitos
    {
        path: '/circuits',
        component: PrognoView,
        meta: { title: "Circuitos" },
        children: [
            {
                path: '',
                name: 'circuitlist',
                component: () => import('@/components/circuits/ViewCircuitList.vue'),
            },
            {
                path: ':circuit/:variant?',
                name: 'circuitDetails',
                component: () => import('@/components/circuits/ViewOneCircuit.vue'),
                meta: { title: "Detalles de circuito" }
            },
        ]
    },

    // Ranking
    {
        path: '/ranking',
        meta: { requiresAuth: true, requiresCommunity: true },
        component: PrognoView,
        children: [{
            path: ':competition?/:season?',
            alias: ['', ':competition?'],
            name: 'ranking',
            component: () => import('@/components/ranking/Ranking.vue'),
            meta: { title: "Ranking" }
        }]
    },

    // Comunidades
    {
        path: '/communities',
        meta: { requiresAuth: true, title: "Comunidades" },
        component: PrognoView,
        children: [
            {
                path: '',
                name: 'communitiesList',
                component: () => import('@/components/communities/ViewCommunitiesList.vue'),
            },
            {
                path: ':community',
                name: 'communitiesDetails',
                component: () => import('@/components/communities/ViewOneCommunity.vue'),
                meta: { title: "Detalles de la comunidad" }
            }
        ]
    },
    {
        path: '/invitation/:community/:code?',
        meta: { requiresAuth: true, title: "Invitación a una comunidad" },
        component: PrognoView,
        children: [{
            path: '',
            name: 'invitation',
            component: () => import('@/components/communities/InvitationToCommunity.vue'),
        }]
    },

    // Grandes Premios
    {
        path: '/gps',
        name: 'gplist',
        meta: { requiresAuth: true, title: "Grandes Premios" },
        component: PrognoView,
        children: [
            {
                path: ':competition?/:season?',
                alias: ['', ':competition?'],
                component: EmptyRoutedView,
                meta: {title: "Lista de Grandes Premios"},
                children: [
                    {
                        path: '',
                        component: () => import('@/components/gps/list/ViewGrandPrixList.vue'),
                        meta: {title: "Temporada"}
                    },
                    {
                        path: ':id',
                        name: 'gpdetails',
                        component: () => import('@/components/gps/ViewOneGrandPrix.vue'),
                        meta: {title: "Gran Premio"}
                    }
                ]
            }
        ]
    },

    // Fallback
    {
        path: "/404",
        component: LandingView,
        children: [{
            name: 'Not Found',
            path: '',
            component: () => import('@/components/error/ErrorNotFound.vue'),
        }]
    },
    {
        path: '/:pathMatch(.*)',
        redirect: { path: "/404" }
    }
];