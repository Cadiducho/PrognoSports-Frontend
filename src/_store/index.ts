import Vue from 'vue'
import Vuex from 'vuex'
import {IAuthState} from "@/_store/modules/AuthModule";
import {ICommunityState} from "@/_store/modules/CommunityModule";
import {IUserState} from "@/_store/modules/UserModule";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export interface IRootState {
  auth: IAuthState,
  community: ICommunityState,
  user: IUserState,
}

export default new Vuex.Store<IRootState>({strict: debug})