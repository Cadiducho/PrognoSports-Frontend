import {communityService} from "@/_services/community.service";
import Vue from 'vue'
import {COMMUNITY_REQUEST} from "@/_store/actions.type";
import {USER_SET_CURRENT_COMMUNITY} from "@/_store/mutations.type";

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
                commit(USER_SET_CURRENT_COMMUNITY, community);
            })
            .catch(resp => {
                commit(USER_SET_CURRENT_COMMUNITY, {});
            })
        });
    }
};

const mutations = {
    [USER_SET_CURRENT_COMMUNITY]: (state, community) => {
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