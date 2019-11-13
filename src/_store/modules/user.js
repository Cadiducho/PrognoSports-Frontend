import { USER_REQUEST, USER_ERROR, USER_SUCCESS } from '../actions/user'
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
    }
};

export default {
    state,
    getters,
    actions,
    mutations,
}