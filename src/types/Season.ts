import {Competition} from "@/types/Competition";

export interface Season {
    id: number;
    competition: Competition;
    name: string;
    totalEvents: number;
}