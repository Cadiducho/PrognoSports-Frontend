import Vue from 'vue'
import Vuex from 'vuex'
import {IAuthState} from "@/_store/modules/AuthModule";
import {ICommunityState} from "@/_store/modules/CommunityModule";
import {IDriverState} from "@/_store/modules/DriversModule";
import {IGPsState} from "@/_store/modules/GrandPrixesModule";
import {IUserState} from "@/_store/modules/UserModule";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export interface IRootState {
  auth: IAuthState,
  community: ICommunityState,
  drivers: IDriverState,
  grandprix: IGPsState,
  user: IUserState,
}

export default new Vuex.Store<IRootState>({strict: debug})