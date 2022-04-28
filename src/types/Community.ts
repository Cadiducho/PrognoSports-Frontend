import {User} from "@/types/User";
import {Competition} from "@/types/Competition";
import {RuleSet} from "@/types/RuleSet";

export interface ICommunity {
    id: number;
    name: string;
    description: string;
    competition: Competition;
    image_url: string;
    open: boolean;
    owner: User;
    created: Date | string,
    members_amount: number;
    user_is_member: boolean;
    invitation: string;

    defaultRuleSet: RuleSet;
}

export class Community implements ICommunity {
    competition: Competition;
    created: Date;
    defaultRuleSet: RuleSet;
    description: string;
    id: number;
    image_url: string;
    invitation: string;
    members_amount: number;
    user_is_member: boolean;
    name: string;
    open: boolean;
    owner: User;

    constructor(data: ICommunity) {
        this.competition = data.competition;
        this.created = new Date(data.created);
        this.defaultRuleSet = data.defaultRuleSet ? new RuleSet(data.defaultRuleSet) : {id: 0} as RuleSet;
        this.description = data.description;
        this.id = data.id;
        this.image_url = data.image_url;
        this.invitation = data.invitation;
        this.members_amount = data.members_amount;
        this.user_is_member = data.user_is_member;
        this.name = data.name;
        this.open = data.open;
        this.owner = data.owner;
    }
}