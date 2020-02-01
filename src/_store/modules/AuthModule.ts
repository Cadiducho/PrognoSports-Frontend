import { userService } from '@/_services';
import {ActionTree, GetterTree, MutationTree} from "vuex";
import {State} from "@/_store/interfaces/auth";
import types from '@/_store/types/AuthTypes';
import userTypes from '@/_store/types/UserTypes';
import communityTypes from '@/_store/types/CommunityTypes';

const namespaced: boolean = true;

const state: State = {
    token: localStorage.getItem('user-token') || '',
    status: '',
    hasLoadedOnce: false
};

const getters: GetterTree<State, any> = {
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status,
    authToken: state => state.token,
};

const actions: ActionTree<State, any> = {
    [types.actions.AUTH_REQUEST]: ({commit, dispatch}, {username, password}) => {
        return new Promise((resolve, reject) => {
            commit(types.mutations.AUTH_REQUEST_LOADING);

            userService.login(username, password)
            .then(
                token => {
                    localStorage.setItem('user-token', token);
                    commit(types.mutations.AUTH_SUCCESS, token);
                    commit('user/' + userTypes.mutations.REMOVE_REGISTERED_MAIL_STATE, null, {root: true});
                    dispatch('user/' + userTypes.mutations.USER_REQUEST, null, {root: true});
                    resolve(token);
                },
                error => {
                    commit(types.mutations.AUTH_ERROR, error);
                    localStorage.removeItem('user-token');
                    reject(error);
                }
            );
        });
    },
    [types.actions.AUTH_LOGOUT]: ({commit, dispatch}) => {
        return new Promise((resolve, reject) => {
            commit(types.mutations.AUTH_LOGOUT_MUTATION);
            commit(communityTypes.mutations.USER_SET_CURRENT_COMMUNITY, {});
            localStorage.removeItem('user-token');
            resolve();
        })
    }
};

const mutations: MutationTree<State> = {
    [types.mutations.AUTH_REQUEST_LOADING]: (state) => {
        state.status = 'loading';
    },
    [types.mutations.AUTH_SUCCESS]: (state, token) => {
        state.status = 'success';
        state.token = token;
        state.hasLoadedOnce = true;
    },
    [types.mutations.AUTH_ERROR]: (state) => {
        state.status = 'error';
        state.hasLoadedOnce = true;
    },
    [types.mutations.AUTH_LOGOUT_MUTATION]: (state) => {
        state.token = '';
    }
};

export default {
    namespaced,
    state,
    getters,
    actions,
    mutations,
};