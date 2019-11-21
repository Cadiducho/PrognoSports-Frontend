import {COMMUNITY_REQUEST, USER_CURRENT_COMMUNITY} from "@/_store/actions/community";
import {communityService} from "@/_services/community.service";
import Vue from 'vue'

const state = {
    currentCommunityId: localStorage.getItem('current-community') || '',
    currentCommunity: {}
};

const getters = {
    thereIsCurrentCommunity: state => !!state.currentCommunityId,
};

const actions = {
    [COMMUNITY_REQUEST]: ({commit, dispatch}) => {
        return new Promise((resolve, reject) => {
            communityService.getCurrentCommunity(state.currentCommunityId)
            .then(community => {
                commit(USER_CURRENT_COMMUNITY, community);
            })
            .catch(resp => {
                commit(USER_CURRENT_COMMUNITY, {});
            })
        });
    }
};

const mutations = {
    [USER_CURRENT_COMMUNITY]: (state, community) => {
        Vue.set(state, 'currentCommunity', community);
        localStorage.setItem('current-community', community.id);
        Vue.set(state, 'currentCommunityId', community.id);
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};