import {User} from "@/types/User";
import {Dictionary} from "@/types/Dictionary";
import {RaceSession} from "@/types/RaceSession";

export interface IRuleSet {
    id: number;
    creator: User;
    description: string;
    displayname: string;
    isPublic: boolean;
    data: IRuleSetData;
}

export interface IRuleSetData {
    predictedPositions: Dictionary<string, number>;
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

    /**
     * Obtener la cantidad de posiciones a pronosticar para una comunidad y sesión de Gran Premio concreta
     * @param session La sesión de Gran Premio
     */
    public cantidadPilotosPronosticados(session: RaceSession): number {
        return this.data?.predictedPositions[session.name] || 0;
    }

}

export class RuleSetData implements IRuleSetData {
    predictedPositions: Dictionary<string, number>;
    pointsByEqualsPosition: Dictionary<string, Dictionary<number, number>>;
    pointsByNextOfFollowingPosition: Dictionary<string, number>;
    pointsByNextPosition: Dictionary<string, number>;
    pointsByPreviousOfPreviousPosition: Dictionary<string, number>;
    pointsByPreviousPosition: Dictionary<string, number>;
    pointsIfIsNotInPodium: Dictionary<string, number>;
    pointsIfIsNotInResults: Dictionary<string, number>;

    constructor(data: IRuleSetData) {
        this.predictedPositions = data.predictedPositions;
        this.pointsByEqualsPosition = data.pointsByEqualsPosition;
        this.pointsByNextOfFollowingPosition = data.pointsByNextOfFollowingPosition;
        this.pointsByNextPosition = data.pointsByNextPosition;
        this.pointsByPreviousOfPreviousPosition = data.pointsByPreviousOfPreviousPosition;
        this.pointsByPreviousPosition = data.pointsByPreviousPosition;
        this.pointsIfIsNotInPodium = data.pointsIfIsNotInPodium;
        this.pointsIfIsNotInResults = data.pointsIfIsNotInResults;
    }
}