import {Competition, CompetitionDto, mapCompetition} from "@/types/Competition";
import {mapRuleSet, RuleSet, RuleSetDto} from "@/types/RuleSet";
import {mapUser, User, UserDto} from "@/types/User";

/** Forma de la comunidad tal y como la devuelve la API */
export interface CommunityDto {
    id: number;
    name: string;
    description: string;
    competition: CompetitionDto;
    hasImage: boolean;
    open: boolean;
    owner: UserDto;
    created: string;
    members_amount: number;
    user_is_member: boolean;
    invitation: string;

    defaultRuleSet?: RuleSetDto;
}

export interface Community {
    id: number;
    name: string;
    description: string;
    competition: Competition;
    hasImage: boolean;
    open: boolean;
    owner: User;
    created: Date;
    members_amount: number;
    user_is_member: boolean;
    invitation: string;

    defaultRuleSet: RuleSet;
}

export function mapCommunity(dto: CommunityDto): Community {
    return {
        id: dto.id,
        name: dto.name,
        description: dto.description,
        competition: dto.competition && mapCompetition(dto.competition),
        hasImage: dto.hasImage,
        open: dto.open,
        owner: dto.owner && mapUser(dto.owner),
        created: new Date(dto.created),
        members_amount: dto.members_amount,
        user_is_member: dto.user_is_member,
        invitation: dto.invitation,
        defaultRuleSet: dto.defaultRuleSet?.data ? mapRuleSet(dto.defaultRuleSet) : {id: 0} as RuleSet,
    };
}
