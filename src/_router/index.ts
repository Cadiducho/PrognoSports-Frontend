import {createRouter, createWebHistory} from 'vue-router'

import {routes} from "@/_router/routes";
import {auth, community, admin, home, data} from "@/_router/middleware";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

// Se solicitan datos y establece user y comunidad en el estado, si existen
router.beforeEach(data);

// Se comprueba si la ruta especificada requiere auth, si no manda a /login
router.beforeEach(auth);

// Se comprueba si la ruta especificada requiere comunidad activa, si no manda a /communities
router.beforeEach(community);

// Verificación admin
router.beforeEach(admin);

// Si está iniciado sesión y solicita /, mandar a /home
router.beforeEach(home);

export default router;