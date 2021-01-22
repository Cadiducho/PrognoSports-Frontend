import Vue from 'vue';
import Vuex from 'vuex';

import Auth from './modules/AuthModule'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        Auth
    }
});