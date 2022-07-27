import {User} from "@/types/User";
import {GrandPrix} from "@/types/GrandPrix";
import {Dictionary} from "@/types/Dictionary";

export interface UserPoints {
    user: User;
    grandPrix: GrandPrix;
    pointsBySession: Dictionary<string, number>;
    hitPercentageBySession: Dictionary<string, number>;
    pointsInGP: number;
    hitPercentageInGP: number;
    standings: number,
    previousStandings: number;
    accumulatedPoints: number;
}