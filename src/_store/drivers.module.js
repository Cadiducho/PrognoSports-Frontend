import {
    FETCH_DRIVERS_LIST,
} from "@/_store/actions.type";
import {
    FETCH_DRIVERS_LIST_END,
    FETCH_DRIVERS_LIST_START,
} from "@/_store/mutations.type";
import {driversService} from "@/_services";

const state = {
    driverList: [],
    isLoadingDriverList: true,
};

const getters = {
    driverList(state) {
        return state.driverList;
    },
    isLoadingDriverList(state) {
        return state.isLoadingDriverList;
    },
};

const actions = {
    [FETCH_DRIVERS_LIST]: ({commit, dispatch}, grandprix) => {
        commit(FETCH_DRIVERS_LIST_START);
        return new Promise((resolve, reject) => {
            driversService.getDriversInGrandPrix(grandprix)
            .then(drivers => {
                commit(FETCH_DRIVERS_LIST_END, drivers);
            })
        });
    },
};

const mutations = {
    [FETCH_DRIVERS_LIST_START]: (state) => {
        state.isLoadingDriverList = true;
    },
    [FETCH_DRIVERS_LIST_END]: (state, drivers) => {
        state.driverList = drivers;
        state.isLoadingDriverList = false;
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};