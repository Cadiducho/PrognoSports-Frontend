import {GrandPrix} from "@/types/GrandPrix";

export interface State {
    grandPrix: undefined | GrandPrix,
    isLoadingGrandPrix: boolean,
    startGrid: any, //ToDo: Crear esta interface
    nextGp: undefined | GrandPrix,
    isLoadingNextGp: boolean,
    gpList: Array<GrandPrix>,
    isLoadingGps: boolean,
    qualiTipps: any, //ToDo: Crear esta interface
}