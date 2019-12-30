import Vue from 'vue'
import Vuex from 'vuex'
import user from './user.module'
import auth from './modules/auth'
import community from "./modules/community";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    user,
    auth,
    community,
  },
  strict: debug,
})