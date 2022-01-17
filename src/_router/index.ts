import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

import {routes} from "@/_router/routes";
import {auth, community, home} from "@/_router/middleware";

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.beforeEach(auth);
router.beforeEach(home);
router.beforeEach(community);

export default router;