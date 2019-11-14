import {
    USER_REQUEST,
    USER_ERROR,
    USER_SUCCESS,
    USER_REGISTER,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_ERROR
} from '../actions/user'
import { AUTH_LOGOUT } from '../actions/auth'
import { userService } from '../../_services';
import Vue from 'vue'

const state = { status: '', profile: {} };

const getters = {
    getProfile: state => state.profile,
    isProfileLoaded: state => !!state.profile.name,
};

const actions = {
    [USER_REQUEST]: ({commit, dispatch}) => {
        commit(USER_REQUEST);
        userService.getMe()
        .then(user => {
            commit(USER_SUCCESS, user);
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
    },
    [USER_REGISTER_ERROR]: (state) => {
        state.status = 'error';
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
}