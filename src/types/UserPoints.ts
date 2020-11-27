import {User} from "@/types/User";
import {GrandPrix} from "@/types/GrandPrix";

export interface UserPoints {
    user: User;
    grandPrix: GrandPrix;
    pointsInQuealify: number;
    pointsInRace: number;
    accumulatedPoints: number;
}