import { userService } from '@/_services';
import Vue from 'vue'
import {
    AUTH_LOGOUT, REMOVE_REGISTERED_MAIL_STATE, USER_CHANGE_PWD, USER_CHANGE_PWD_SUCCESS,
    USER_CURRENT_COMMUNITY,
    USER_ERROR, USER_FORGOT_PWD,
    USER_REGISTER, USER_REGISTER_ERROR, USER_REGISTER_SUCCESS,
    USER_REQUEST,
    USER_SUCCESS
} from "@/_store/actions.type";

const state = { status: '', profile: {}, registeredMail: ''};

const getters = {
    getProfile: state => state.profile,
    isProfileLoaded: state => !!state.profile.name,
    getRegisteredMail: state => state.registeredMail,
};

const actions = {
    [USER_REQUEST]: ({commit, rootGetters, dispatch}) => {
        commit(USER_REQUEST);
        userService.getMe()
        .then(user => {
            commit(USER_SUCCESS, user);
            if (!rootGetters.thereIsCurrentCommunity) {
                // Si no hay comunidad guardada en el estado, intentar poner la que tiene por defecto el getMe()
                commit(USER_CURRENT_COMMUNITY, user.currentCommunity);
            }
        })
        .catch(resp => {
            commit(USER_ERROR);
            console.log("Auth error..." + resp);
            // if resp is unauthorized, logout, to
            dispatch(AUTH_LOGOUT);
        })
    },

    [USER_REGISTER]: ({commit, dispatch}, { email, username, password }) => {
        return new Promise((resolve, reject) => {
            commit(USER_REGISTER);
            userService.register(email, username, password)
            .then(
                token => {
                    commit(USER_REGISTER_SUCCESS, email);
                    resolve(email);
                },
                error => {
                    commit(USER_REGISTER_ERROR);
                    console.log("Register error..." + error);
                    reject(error);
                });
        });
    },

    [USER_FORGOT_PWD]: ({commit, dispatch}, { email }) => {
        return new Promise((resolve, reject) => {
            userService.sendForgotPassword(email)
            .then(
                () => {
                    resolve();
                },
                error => {
                    commit(REMOVE_REGISTERED_MAIL_STATE);
                    reject(error);
                });
        });
    },

    [USER_CHANGE_PWD]: ({commit, dispatch}, { email, inputToken, inputPassword }) => {
        return new Promise((resolve, reject) => {
            userService.changePassword(email, inputToken, inputPassword)
            .then(
                () => {
                    commit(USER_CHANGE_PWD_SUCCESS, email);
                    resolve();
                },
                error => {
                    commit(REMOVE_REGISTERED_MAIL_STATE);
                    reject(error);
                });
        });
    },
};

const mutations = {
    [USER_REQUEST]: (state) => {
        state.status = 'loading';
    },
    [USER_SUCCESS]: (state, user) => {
        state.status = 'success';
        Vue.set(state, 'profile', user);
    },
    [USER_ERROR]: (state) => {
        state.status = 'error';
    },
    [AUTH_LOGOUT]: (state) => {
        state.profile = {};
    },
    [USER_REGISTER]: (state) => {
        state.status = 'loading';
    },
    [USER_REGISTER_SUCCESS]: (state, email) => {
        state.status = 'success';
        Vue.set(state, 'registeredMail', email);
    },
    [USER_REGISTER_ERROR]: (state) => {
        state.status = 'error';
    },
    [USER_CHANGE_PWD_SUCCESS]: (state, email) => {
        Vue.set(state, 'registeredMail', email);
    },
    [REMOVE_REGISTERED_MAIL_STATE]: (state) => {
        Vue.set(state, 'registeredMail', '');
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
}