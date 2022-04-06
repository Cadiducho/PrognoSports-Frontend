import {User} from "@/types/User";
import {RaceSession} from "@/types/RaceSession";
import {Dictionary} from "@/types/Dictionary";

export interface IRuleSet {
    id: number;
    creator: User;
    description: string;
    displayname: string;
    isPublic: boolean;
    data: IRuleSetData;
}

export interface IRuleSetData {
    pointsByEqualsPosition: Dictionary<string, Dictionary<number, number>>;
    pointsByNextPosition: Dictionary<string, number>;
    pointsByNextOfFollowingPosition: Dictionary<string, number>;
    pointsByPreviousPosition: Dictionary<string, number>;
    pointsByPreviousOfPreviousPosition: Dictionary<string, number>;
    pointsIfIsNotInPodium: Dictionary<string, number>;
    pointsIfIsNotInResults: Dictionary<string, number>;
}

export class RuleSet implements IRuleSet {
    creator: User;
    data: RuleSetData;
    description: string;
    displayname: string;
    id: number;
    isPublic: boolean;

    constructor(iData: IRuleSet) {
        this.creator = iData.creator;
        this.data = new RuleSetData(iData.data);
        this.description = iData.description;
        this.displayname = iData.displayname;
        this.id = iData.id;
        this.isPublic = iData.isPublic;
    }
}

export class RuleSetData implements IRuleSetData {
    pointsByEqualsPosition: Dictionary<string, Dictionary<number, number>>;
    pointsByNextOfFollowingPosition: Dictionary<string, number>;
    pointsByNextPosition: Dictionary<string, number>;
    pointsByPreviousOfPreviousPosition: Dictionary<string, number>;
    pointsByPreviousPosition: Dictionary<string, number>;
    pointsIfIsNotInPodium: Dictionary<string, number>;
    pointsIfIsNotInResults: Dictionary<string, number>;

    constructor(data: IRuleSetData) {
        this.pointsByEqualsPosition = data.pointsByEqualsPosition;
        this.pointsByNextOfFollowingPosition = data.pointsByNextOfFollowingPosition;
        this.pointsByNextPosition = data.pointsByNextPosition;
        this.pointsByPreviousOfPreviousPosition = data.pointsByPreviousOfPreviousPosition;
        this.pointsByPreviousPosition = data.pointsByPreviousPosition;
        this.pointsIfIsNotInPodium = data.pointsIfIsNotInPodium;
        this.pointsIfIsNotInResults = data.pointsIfIsNotInResults;
    }
}