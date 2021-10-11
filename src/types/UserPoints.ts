import {User} from "@/types/User";
import {GrandPrix} from "@/types/GrandPrix";

export interface UserPoints {
    user: User;
    grandPrix: GrandPrix;
    pointsInQualify: number;
    pointsInRace: number;
    pointsInGP: number;
    standings: number,
    previousStandings: number;
    accumulatedPoints: number;
}