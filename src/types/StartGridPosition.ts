import {Driver} from "@/types/Driver";
import {GrandPrix} from "@/types/GrandPrix";

export interface StartGridPosition {
    gp: GrandPrix;
    driver: Driver;
    position: number;
    isFromPit: boolean;
    note: string;
}