import { userService } from '@/_services';
import Vue from 'vue'
import {State} from "@/_store/interfaces/user";
import {ActionTree, GetterTree, MutationTree} from "vuex";
import types from "@/_store/types/UserTypes";
import authTypes from "@/_store/types/AuthTypes";
import communityTypes from "@/_store/types/CommunityTypes";

const namespaced: boolean = true;

const state: State = {
    status: '',
    profile: undefined,
    registeredMail: ''
};

const getters: GetterTree<State, any> = {
    getProfile: state => state.profile,
    isProfileLoaded: state => {
        if (state.profile === undefined) return false;
        return !!state.profile.username;
    },
    getRegisteredMail: state => state.registeredMail,
};

const actions: ActionTree<State, any> = {
    [types.actions.USER_REQUEST]: ({commit, rootGetters, dispatch}) => {
        commit(types.mutations.USER_REQUEST);
        userService.getMe()
            .then(user => {
                commit(types.mutations.USER_SUCCESS, user);
                if (!rootGetters.thereIsCurrentCommunity) {
                    // Si no hay comunidad guardada en el estado, intentar poner la que tiene por defecto el getMe()
                    commit('community/' + communityTypes.mutations.USER_SET_CURRENT_COMMUNITY, user.currentCommunity, {root: true});
                }
            })
            .catch(resp => {
                commit(types.mutations.USER_ERROR);
                console.log("Auth error..." + resp);
                // if resp is unauthorized, logout, to
                dispatch('auth/' + authTypes.actions.AUTH_LOGOUT, null, {root: true});
            })
    },

    [types.actions.USER_REGISTER]: ({commit, dispatch}, { email, username, password }) => {
        return new Promise((resolve, reject) => {
            commit(types.mutations.USER_REGISTER);
            userService.register(email, username, password)
                .then(
                    token => {
                        commit(types.mutations.USER_REGISTER_SUCCESS, email);
                        resolve(email);
                    },
                    error => {
                        commit(types.mutations.USER_REGISTER_ERROR);
                        console.log("Register error..." + error);
                        reject(error);
                    });
        });
    },

    [types.actions.USER_FORGOT_PWD]: ({commit, dispatch}, { email }) => {
        return new Promise((resolve, reject) => {
            userService.sendForgotPassword(email)
                .then(
                    () => {
                        resolve();
                    },
                    error => {
                        commit(types.mutations.REMOVE_REGISTERED_MAIL_STATE);
                        reject(error);
                    });
        });
    },

    [types.actions.USER_CHANGE_PWD]: ({commit, dispatch}, { email, inputToken, inputPassword }) => {
        return new Promise((resolve, reject) => {
            userService.changePassword(email, inputToken, inputPassword)
                .then(
                    () => {
                        commit(types.mutations.USER_CHANGE_PWD_SUCCESS, email);
                        resolve();
                    },
                    error => {
                        commit(types.mutations.REMOVE_REGISTERED_MAIL_STATE);
                        reject(error);
                    });
        });
    },
};

const mutations: MutationTree<State> = {
    [types.mutations.USER_REQUEST]: (state) => {
        state.status = 'loading';
    },
    [types.mutations.USER_SUCCESS]: (state, user) => {
        state.status = 'success';
        Vue.set(state, 'profile', user);
    },
    [types.mutations.USER_ERROR]: (state) => {
        state.status = 'error';
    },
    [types.mutations.AUTH_LOGOUT]: (state) => {
        state.profile = undefined;
    },
    [types.mutations.USER_REGISTER]: (state) => {
        state.status = 'loading';
    },
    [types.mutations.USER_REGISTER_SUCCESS]: (state, email) => {
        state.status = 'success';
        Vue.set(state, 'registeredMail', email);
    },
    [types.mutations.USER_REGISTER_ERROR]: (state) => {
        state.status = 'error';
    },
    [types.mutations.USER_CHANGE_PWD_SUCCESS]: (state, email) => {
        Vue.set(state, 'registeredMail', email);
    },
    [types.mutations.REMOVE_REGISTERED_MAIL_STATE]: (state) => {
        Vue.set(state, 'registeredMail', '');
    },
};

export default {
    namespaced,
    state,
    getters,
    actions,
    mutations,
}