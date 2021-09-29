import Vue from 'vue';
import Vuex from 'vuex';

import Auth from './modules/AuthModule'
import Style from './modules/StyleModule'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        Auth,
        Style
    }
});