import {Driver} from "@/types/Driver";

export interface State {
    driverList: Array<Driver>;
    isLoadingDriverList: boolean;
};