import {mapUser, User, UserDto} from "@/types/User";
import {Dictionary} from "@/types/Dictionary";

/** Los datos de las reglas se usan tal y como llegan de la API */
export interface RuleSetData {
    predictedPositions: Dictionary<number, number>; // Session ID -> Number of predicted positions
    pointsByEqualsPosition: Dictionary<number, Dictionary<number, number>>;
    pointsByNextPosition: Dictionary<number, number>; // Session ID -> Points
    pointsByNextOfFollowingPosition: Dictionary<number, number>;
    pointsByPreviousPosition: Dictionary<number, number>;
    pointsByPreviousOfPreviousPosition: Dictionary<number, number>;
    pointsIfIsNotInPodium: Dictionary<number, number>;
    pointsIfIsNotInResults: Dictionary<number, number>;
    pointsByTopScorer: number;
}

/** Forma del conjunto de reglas tal y como lo devuelve la API */
export interface RuleSetDto {
    id: number;
    creator: UserDto;
    description: string;
    displayname: string;
    isPublic: boolean;
    data: RuleSetData;
}

export interface RuleSet {
    id: number;
    creator: User;
    description: string;
    displayname: string;
    isPublic: boolean;
    data: RuleSetData;
}

export function mapRuleSet(dto: RuleSetDto): RuleSet {
    return {
        id: dto.id,
        creator: dto.creator && mapUser(dto.creator),
        description: dto.description,
        displayname: dto.displayname,
        isPublic: dto.isPublic,
        data: dto.data,
    };
}
