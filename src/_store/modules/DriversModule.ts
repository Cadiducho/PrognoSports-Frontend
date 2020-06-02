import {driversService} from "@/_services";
import store from '@/_store'
import {Action, getModule, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import {Driver} from "@/types/Driver";
import {GrandPrix} from "@/types/GrandPrix";

export interface IDriverState {
    driverList: Array<Driver>,
    isLoadingDriverList: boolean,
}

@Module({dynamic: true, store: store, namespaced: true, name: 'driver' })
class DriversMod extends VuexModule implements IDriverState {
    driverList = [] as Driver[];
    loadingDriverList = true;

    get getDriverList() {
        return this.driverList;
    }

    get isLoadingDriverList() {
        return this.loadingDriverList;
    }

    @Action
    async fetchDriversList(grandPrix: GrandPrix) {
        this.fetchDriversListStart();
        return new Promise((resolve, reject) => {
            driversService.getDriversInGrandPrix(grandPrix)
                .then(drivers => {
                    this.fetchDriversListEnd(drivers);
                })
        });
    }

    @Mutation
    fetchDriversListStart() {
        this.loadingDriverList = true;
    }

    @Mutation
    fetchDriversListEnd(drivers: Array<Driver>) {
        this.loadingDriverList = false;
        this.driverList = drivers;
    }
}
export const DriversModule: DriversMod = getModule(DriversMod);