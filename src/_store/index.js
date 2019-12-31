import Vue from 'vue'
import Vuex from 'vuex'
import user from './user.module'
import auth from './auth.module'
import community from "./community.module";
import grandprixes from "./grandprixes.module";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    user,
    auth,
    community,
    grandprixes,
  },
  strict: debug,
})