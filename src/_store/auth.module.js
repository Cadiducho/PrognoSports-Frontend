import { userService } from '../_services';
import {
    AUTH_LOGOUT,
    AUTH_REQUEST,
    USER_REQUEST
} from "@/_store/actions.type";
import {
    AUTH_ERROR,
    AUTH_LOGOUT_MUTATION,
    AUTH_REQUEST_LOADING,
    AUTH_SUCCESS,
    REMOVE_REGISTERED_MAIL_STATE, USER_SET_CURRENT_COMMUNITY
} from "@/_store/mutations.type";

const state = { token: localStorage.getItem('user-token') || '', status: '', hasLoadedOnce: false };

const getters = {
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status,
    authToken: state => state.token,
};

const actions = {
    [AUTH_REQUEST]: ({commit, dispatch}, {username, password}) => {
        return new Promise((resolve, reject) => {
            commit(AUTH_REQUEST_LOADING);

            userService.login(username, password)
            .then(
                token => {
                    localStorage.setItem('user-token', token);
                    commit(AUTH_SUCCESS, token);
                    commit(REMOVE_REGISTERED_MAIL_STATE);
                    dispatch(USER_REQUEST);
                    resolve(token);
                },
                error => {
                    commit(AUTH_ERROR, error);
                    localStorage.removeItem('user-token');
                    reject(error);
                }
            );
        });
    },
    [AUTH_LOGOUT]: ({commit, dispatch}) => {
        return new Promise((resolve, reject) => {
            commit(AUTH_LOGOUT_MUTATION);
            commit(USER_SET_CURRENT_COMMUNITY, {});
            localStorage.removeItem('user-token');
            resolve();
        })
    }
};

const mutations = {
    [AUTH_REQUEST]: (state) => {
        state.status = 'loading';
    },
    [AUTH_SUCCESS]: (state, token) => {
        state.status = 'success';
        state.token = token;
        state.hasLoadedOnce = true;
    },
    [AUTH_ERROR]: (state) => {
        state.status = 'error';
        state.hasLoadedOnce = true;
    },
    [AUTH_LOGOUT]: (state) => {
        state.token = '';
    }
};

export default {
    state,
    getters,
    actions,
    mutations,
};