import {GrandPrix} from "@/types/GrandPrix";

export interface RaceSession {
    name: string;
    code: string
    grandPrix: GrandPrix;
    date: Date;
}