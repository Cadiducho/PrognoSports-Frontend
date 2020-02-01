import {driversService} from "@/_services";
import {State} from "@/_store/interfaces/drivers";
import {ActionTree, GetterTree, MutationTree} from "vuex";
import types from "@/_store/types/DriversTypes";

const namespaced: boolean = true;

const state: State = {
    driverList: [],
    isLoadingDriverList: true,
};

const getters: GetterTree<State, any> = {
    driverList(state) {
        return state.driverList;
    },
    isLoadingDriverList(state) {
        return state.isLoadingDriverList;
    },
};

const actions: ActionTree<State, any> = {
    [types.actions.FETCH_DRIVERS_LIST]: ({commit, dispatch}, grandprix) => {
        commit(types.mutations.FETCH_DRIVERS_LIST_START);
        return new Promise((resolve, reject) => {
            driversService.getDriversInGrandPrix(grandprix)
                .then(drivers => {
                    commit(types.mutations.FETCH_DRIVERS_LIST_END, drivers);
                })
        });
    },
};

const mutations: MutationTree<State> = {
    [types.mutations.FETCH_DRIVERS_LIST_START]: (state) => {
        state.isLoadingDriverList = true;
    },
    [types.mutations.FETCH_DRIVERS_LIST_END]: (state, drivers) => {
        state.driverList = drivers;
        state.isLoadingDriverList = false;
    },
};

export default {
    namespaced,
    state,
    getters,
    actions,
    mutations,
};