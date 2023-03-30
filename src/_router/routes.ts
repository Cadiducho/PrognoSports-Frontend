import LandingLayout from "@/layouts/LandingLayout.vue";
import PrognoLayout from "@/layouts/PrognoLayout.vue";
import EmptyRoutedLayout from "@/layouts/EmptyRoutedLayout.vue";

export const routes = [

    // Landing, about y demás páginas genéricas
    {
        path: '/',
        component: LandingLayout,
        children: [
            {
                name: 'landing',
                alias: ['/landing'],
                path: '',
                component: () => import('@/pages/landing/LandingHome.vue'),
            },
            {
                name: 'faq',
                path: '/faq',
                component: () => import('@/pages/landing/Faq.vue'),
            },
            {
                name: 'contact',
                path: '/contact',
                component: () => import('@/pages/landing/Contact.vue'),
            },
            {
                name: 'terms',
                path: '/terms',
                component: () => import('@/pages/landing/Terms.vue'),
            },
            {
                name: 'privacy',
                path: '/privacy',
                component: () => import('@/pages/landing/Privacy.vue'),
            },
            {
                name: 'rules',
                path: '/rules',
                component: () => import('@/pages/landing/Rules.vue'),
            },
        ]
    },

    // Autentificación
    {
        path: '/login',
        component: LandingLayout,
        children: [{
            name: 'login',
            path: '',
            component: () => import('@/pages/auth/Login.vue'),
        }]
    },
    {
        path: '/logout',
        component: LandingLayout,
        children: [{
            name: 'logout',
            path: '',
            component: () => import('@/pages/auth/Logout.vue'),
        }]
    },
    {
        path: '/register',
        component: LandingLayout,
        children: [{
            name: 'register',
            path: '',
            component: () => import('@/pages/auth/Register.vue'),
        }]
    },
    {
        path: '/forgotpassword',
        component: LandingLayout,
        children: [{
            name: 'forgotpassword',
            path: '',
            component: () => import('@/pages/auth/ForgotPassword.vue'),
        }]
    },

    // Páginas de dentro de la aplicación iniciadas sesión
    {
        path: '/home',
        meta: { requiresAuth: true, requiresCommunity: true },
        component: PrognoLayout,
        children: [{
            path: '',
            name: 'home',
            component: () => import('@/pages/home/Home.vue'),
            meta: { title: "Inicio" }
        }]
    },
    {
        path: '/user/:user?',
        alias: ['/u/:user?'],
        meta: { requiresAuth: true, title: "Usuarios" },
        component: PrognoLayout,
        children: [{
            path: '',
            name: 'user',
            component: () => import('@/pages/user/UserProfile.vue'),
            meta: { title: "Usuario" }
        }]
    },
    {
        path: '/settings',
        meta: { requiresAuth: true, title: "Ajustes" },
        component: PrognoLayout,
        children: [{
            path: '',
            name: 'userSettings',
            component: () => import('@/pages/user/UserSettings.vue'),
            meta: { title: "Ajustes" }
        }]
    },

    // Admin
    {
        path: '/admin',
        meta: { requiresAuth: true, requiresAdmin: true, title: "Admin" },
        component: PrognoLayout,
        children: [
            {
                path: '',
                name: 'admin',
                component: () => import('@/pages/admin/AdminDashboard.vue'),
            },
            {
                path: 'drivers',
                name: 'adminDrivers',
                component: () => import('@/pages/admin/drivers/DriversDashboard.vue'),
                meta: { title: "Pilotos" }
            },
            {
                path: 'constructors',
                name: 'adminConstructors',
                component: () => import('@/pages/admin/constructors/ConstructorsDashboard.vue'),
                meta: { title: "Constructores" }
            },
            {
                path: 'users',
                name: 'adminUsers',
                component: () => import('@/pages/admin/users/UsersDashboard.vue'),
                meta: { title: "Usuarios" }
            },
            {
                path: 'competitions',
                name: 'adminCompetitions',
                component: EmptyRoutedLayout,
                meta: { title: "Competiciones" },
                children: [
                    {
                        path: '',
                        component: () => import('@/pages/admin/competitions/CompetitionsDashboard.vue'),
                    },
                    {
                        path: ':competition',
                        name: 'adminCompetitionEdit',
                        component: () => import('@/pages/admin/competitions/EditCompetition.vue'),
                        meta: { title: "Editar competición" }
                    },
                ],
            },
            {
                path: 'gps',
                component: EmptyRoutedLayout,
                meta: { title: "Grandes Premios" },
                children: [
                    {
                        path: '',
                        name: 'adminGps',
                        component: () => import('@/pages/admin/gps/GrandPrixDashboard.vue'),
                    },
                    {
                        path: ':competition/:season/:id',
                        component: EmptyRoutedLayout,
                        meta: { title: "Gran Premio" },
                        children: [
                            {
                                path: '',
                                name: 'adminGpEdit',
                                meta: { title: "Editar Gran Premio" },
                                component: () => import('@/pages/admin/gps/EditGrandPrix.vue'),
                            },
                            {
                                path: ':session',
                                name: 'adminGpEditSession',
                                meta: { title: "Editar Sesión del Gran Premio" },
                                component: () => import('@/pages/admin/gps/EditSessionGrandPrix.vue'),
                            },
                        ]
                    },
                ],
            },
            {
                path: 'seasons',
                component: EmptyRoutedLayout,
                meta: { title: "Temporadas" },
                children: [
                    {
                        path: '',
                        name: 'adminSeasons',
                        component: () => import('@/pages/admin/seasons/SeasonsDashboard.vue'),
                    },
                    {
                        path: ':season',
                        name: 'adminSeasonsEdit',
                        component: () => import('@/pages/admin/seasons/EditSeason.vue'),
                        meta: { title: "Editar temporada" }
                    },
                ],
            },
            {
                path: 'sessions',
                name: 'adminSessions',
                component: () => import('@/pages/admin/sessions/SessionsDashboard.vue'),
                meta: { title: "Sesiones" },
            },
        ]
    },

    // Creaciones de objetos / news
    {
        path: '/new',
        meta: {requiresAuth: true},
        component: PrognoLayout,
        children: [
            {
                path: 'competition',
                name: 'competitionCreate',
                component: () => import('@/pages/admin/competitions/CreateCompetition.vue'),
                meta: { title: "Nueva competición", requiresAdmin: true }
            },
            {
                path: 'season',
                name: 'seasonCreate',
                component: () => import('@/pages/admin/seasons/CreateSeason.vue'),
                meta: { title: "Nueva temporada", requiresAdmin: true }
            },
            {
                path: 'circuit',
                name: 'circuitCreate',
                component: () => import('@/pages/admin/circuits/CreateCircuit.vue'),
                meta: { title: "Nuevo circuito", requiresAdmin: true }
            },
            {
                path: 'community',
                name: 'communitiesCreate',
                component: () => import('@/pages/communities/CreateCommunity.vue'),
                meta: { title: "Nueva comunidad" }
            },
            {
                path: 'driver',
                name: 'driverCreate',
                component: () => import('@/pages/admin/drivers/CreateDriver.vue'),
                meta: { title: "Nuevo piloto", requiresAdmin: true }
            },
            {
                path: 'grandprix',
                name: 'gpCreate',
                component: () => import('@/pages/admin/gps/CreateGrandPrix.vue'),
                meta: { title: "Nuevo gran premio", requiresAdmin: true }
            },
        ]
    },

    // Circuitos
    {
        path: '/circuits',
        component: PrognoLayout,
        meta: { title: "Circuitos" },
        children: [
            {
                path: '',
                name: 'circuitlist',
                component: () => import('@/pages/circuits/CircuitList.vue'),
            },
            {
                path: ':circuit/:variant?',
                name: 'circuitDetails',
                component: () => import('@/pages/circuits/OneCircuit.vue'),
                meta: { title: "Detalles de circuito" }
            },
        ]
    },

    // Ranking
    {
        path: '/ranking',
        meta: { requiresAuth: true, requiresCommunity: true },
        component: PrognoLayout,
        children: [{
            path: ':competition?/:season?',
            alias: ['', ':competition?'],
            name: 'ranking',
            component: () => import('@/pages/ranking/Ranking.vue'),
            meta: { title: "Ranking" }
        }]
    },

    // Comunidades
    {
        path: '/communities',
        meta: { requiresAuth: true, title: "Comunidades" },
        component: PrognoLayout,
        children: [
            {
                path: '',
                name: 'communitiesList',
                component: () => import('@/pages/communities/CommunitiesList.vue'),
            },
            {
                path: ':community',
                name: 'communitiesDetails',
                component: () => import('@/pages/communities/OneCommunity.vue'),
                meta: { title: "Detalles de la comunidad" }
            }
        ]
    },
    {
        path: '/invitation/:community/:code?',
        meta: { requiresAuth: true, title: "Invitación a una comunidad" },
        component: PrognoLayout,
        children: [{
            path: '',
            name: 'invitation',
            component: () => import('@/pages/communities/InvitationToCommunity.vue'),
        }]
    },

    // Grandes Premios
    {
        path: '/gps',
        name: 'gplist',
        meta: { requiresAuth: true, title: "Grandes Premios" },
        component: PrognoLayout,
        children: [
            {
                path: ':competition?/:season?',
                alias: ['', ':competition?'],
                component: EmptyRoutedLayout,
                meta: {title: "Lista de Grandes Premios"},
                children: [
                    {
                        path: '',
                        component: () => import('@/pages/gps/GrandPrixList.vue'),
                        meta: {title: "Temporada"}
                    },
                    {
                        path: ':id',
                        name: 'gpdetails',
                        component: () => import('@/pages/gps/OneGrandPrix.vue'),
                        meta: {title: "Gran Premio"}
                    }
                ]
            }
        ]
    },

    // Fallback
    {
        path: "/404",
        component: LandingLayout,
        children: [{
            name: 'Not Found',
            path: '',
            component: () => import('@/pages/error/ErrorNotFound.vue'),
        }]
    },
    {
        path: '/:pathMatch(.*)',
        redirect: { path: "/404" }
    }
];