import {grandPrixService} from "@/_services";
import {ActionTree, GetterTree, MutationTree} from "vuex";
import {State} from "@/_store/interfaces/grandprixes";
import types from "@/_store/types/GrandPrixesTypes";

const namespaced: boolean = true;

const state: State = {
    grandPrix: undefined,
    isLoadingGrandPrix: true,
    startGrid: undefined,
    nextGp: undefined,
    isLoadingNextGp: true,
    gpList: [],
    isLoadingGps: true,
    qualiTipps: undefined,
};

const getters: GetterTree<State, any> = {
    grandPrix(state) {
        return state.grandPrix;
    },
    isLoadingGrandPrix(state) {
        return state.isLoadingGrandPrix;
    },
    startGrid(state) {
        return state.startGrid;
    },
    nextGp(state) {
        return state.nextGp;
    },
    isLoadingNextGp(state) {
        return state.isLoadingNextGp;
    },
    gpList(state) {
        return state.gpList;
    },
    isLoadingGps(state) {
        return state.isLoadingGps;
    },
    qualiTipps(state) {
        return state.qualiTipps;
    }
};

const actions: ActionTree<State, any> = {
    [types.actions.FETCH_GRAND_PRIX]: ({commit, dispatch}, {season, id}) => {
        commit(types.mutations.FETCH_GRAND_PRIX_START);
        return new Promise((resolve, reject) => {
            grandPrixService.getGrandPrix(season, id)
                .then(gp => {
                    commit(types.mutations.FETCH_GRAND_PRIX_END, gp);
                })
        });
    },
    [types.actions.FETCH_NEXT_GP]: ({commit, dispatch}, searchType) => {
        commit(types.mutations.FETCH_NEXT_GP_START);
        return new Promise((resolve, reject) => {
            grandPrixService.getNextGrandPrix()
                .then(nextGp => {
                    commit(types.mutations.FETCH_NEXT_GP_END, nextGp);
                })
        });
    },
    [types.actions.FETCH_GP_LIST]: ({commit, dispatch}, searchType) => {
        commit(types.mutations.FETCH_GP_LIST_START);
        commit(types.mutations.FETCH_GP_LIST_END, undefined);
        return new Promise((resolve, reject) => {
            grandPrixService.getGrandPrixesList(searchType, 2020)
                .then(list => {
                    commit(types.mutations.FETCH_GP_LIST_END, list);
                })
        });
    },
    [types.actions.FETCH_TIPPS_LIST]: ({commit, dispatch}, {gp, community}) => {
        return new Promise((resolve, reject) => {
            grandPrixService.getTipps(gp, community)
                .then(list => {
                    commit(types.mutations.FETCH_TIPPS_LIST_END, list);
                })
        });
    },
};

const mutations: MutationTree<State> = {
    [types.mutations.FETCH_NEXT_GP_START]: (state) => {
        state.isLoadingNextGp = true;
    },
    [types.mutations.FETCH_NEXT_GP_END]: (state, gp) => {
        state.nextGp = gp;
        state.isLoadingNextGp = false;
    },
    [types.mutations.FETCH_GP_LIST_START]: (state) => {
        state.isLoadingGps = true;
    },
    [types.mutations.FETCH_GP_LIST_END]: (state, gps) => {
        state.gpList = gps;
        state.isLoadingGps = false;
    },
    [types.mutations.FETCH_GRAND_PRIX_START]: (state) => {
        state.isLoadingGrandPrix = true;
    },
    [types.mutations.FETCH_GRAND_PRIX_END]: (state, gp) => {
        state.grandPrix = gp;
        state.isLoadingGrandPrix = false;
    },
    [types.mutations.FETCH_TIPPS_LIST_END]: (state, tipps) => {
        state.qualiTipps = tipps;
    }
};

export default {
    namespaced,
    state,
    getters,
    actions,
    mutations,
};