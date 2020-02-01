import Vue from 'vue'
import Vuex from 'vuex'
import UserModule from "@/_store/modules/UserModule";
import DriversModule from "@/_store/modules/DriversModule";
import AuthModule from "@/_store/modules/AuthModule";
import CommunityModule from "@/_store/modules/CommunityModule";
import GrandPrixesModule from "@/_store/modules/GrandPrixesModule";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    user: UserModule,
    auth: AuthModule,
    drivers: DriversModule,
    community: CommunityModule,
    grandprix: GrandPrixesModule,
  },
  strict: debug,
})