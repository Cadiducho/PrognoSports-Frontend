import {communityService} from "@/_services/community.service";
import Vue from 'vue'
import {ActionTree, GetterTree, MutationTree} from "vuex";
import {State} from "@/_store/interfaces/community";
import types from "@/_store/types/CommunityTypes";

const namespaced: boolean = true;

const state: State = {
    currentCommunityId: localStorage.getItem('current-community') || '',
    currentCommunity: undefined
};

const getters: GetterTree<State, any>  = {
    thereIsCurrentCommunity: state => !!state.currentCommunityId,
};

const actions: ActionTree<State, any> = {
    [types.actions.COMMUNITY_REQUEST]: ({commit, dispatch}) => {
        return new Promise((resolve, reject) => {
            communityService.getCurrentCommunity(parseInt(state.currentCommunityId))
                .then(community => {
                    commit(types.mutations.USER_SET_CURRENT_COMMUNITY, community);
                })
                .catch(resp => {
                    commit(types.mutations.USER_SET_CURRENT_COMMUNITY, {});
                })
        });
    }
};

const mutations: MutationTree<State> = {
    [types.mutations.USER_SET_CURRENT_COMMUNITY]: (state, community) => {
        Vue.set(state, 'currentCommunity', community);
        localStorage.setItem('current-community', community.id);
        Vue.set(state, 'currentCommunityId', community.id);
    },
};

export default {
    namespaced,
    state,
    getters,
    actions,
    mutations,
};