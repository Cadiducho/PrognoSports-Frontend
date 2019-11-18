import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "../_store";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'landing',
        component: () => import('../views/Landing.vue'),
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('../views/Home.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/login/Login.vue'),
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/login/Register.vue'),
    },
    {
        path: '/forgotpassword',
        name: 'forgotpassword',
        component: () => import('../views/login/ForgotPasword.vue'),
    },
];

export const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/', '/login', '/register', '/forgotpassword'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = store.getters.isAuthenticated;

    if (authRequired && !loggedIn) {
        return next('/login');
    }

    if (to.path === "/" && loggedIn) {
        return next('/home');
    }

    next();
});
