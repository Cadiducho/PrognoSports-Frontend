import {User} from "@/types/User";
import {GrandPrix} from "@/types/GrandPrix";
import {Dictionary} from "@/types/Dictionary";
import {SessionId} from "@/types/RaceSession";

export interface UserPoints {
    user: User;
    grandPrix: GrandPrix;
    pointsBySession: Dictionary<SessionId, number>;
    hitPercentageBySession: Dictionary<SessionId, number>;
    hitsBySession: Dictionary<SessionId, number>;
    pointsInGP: number;
    hitPercentageInGP: number;
    standings: number,
    previousStandings: number;
    accumulatedPoints: number;
    bonusPoints: number;
    hitsInGP: number;
}
