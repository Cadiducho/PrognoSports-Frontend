import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

import {routes} from "@/_router/routes";
import {auth, community, home, data} from "@/_router/middleware";

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

// Se solicitan datos y establece user y comunidad en el estado, si existen
router.beforeEach(data);

// Se comprueba si la ruta especificada requiere auth, si no manda a /login
router.beforeEach(auth);

// Se comprueba si la ruta especificada requiere comunidad activa, si no manda a /communities
router.beforeEach(community);

// Si está iniciado sesión y solicita /, mandar a /home
router.beforeEach(home);

export default router;