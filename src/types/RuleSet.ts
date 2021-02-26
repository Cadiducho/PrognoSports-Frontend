import {User} from "@/types/User";
import {RaceSession} from "@/types/RaceSession";

export interface RuleSet {
    id: number;
    creator: User;
    description: string;
    displayname: string;
    isPublic: boolean;
    data: RuleSetData;
}

export interface RuleSetData {
    pointsByNextPosition: Map<RaceSession, number>;
    pointsByNextOfFollowingPosition: Map<RaceSession, number>;
    pointsByPreviousPosition: Map<RaceSession, number>;
    pointsByPreviousOfPreviousPosition: Map<RaceSession, number>;
    pointsIfIsNotInPodium: Map<RaceSession, number>;
    pointsIfIsNotInResults: Map<RaceSession, number>;
}