import {User} from "@/types/User";
import {Competition} from "@/types/Competition";
import {RuleSet} from "@/types/RuleSet";
import {BASE_URL} from "@/_services";

export interface ICommunity {
    id: number;
    name: string;
    description: string;
    competition: Competition;
    hasImage: boolean;
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
    hasImage: boolean;
    invitation: string;
    members_amount: number;
    user_is_member: boolean;
    name: string;
    open: boolean;
    owner: User;
    changedImage?: Blob;

    constructor(data: ICommunity) {
        this.competition = data.competition;
        this.created = new Date(data.created);
        this.defaultRuleSet = data.defaultRuleSet ? new RuleSet(data.defaultRuleSet) : {id: 0} as RuleSet;
        this.description = data.description;
        this.id = data.id;
        this.hasImage = data.hasImage;
        this.invitation = data.invitation;
        this.members_amount = data.members_amount;
        this.user_is_member = data.user_is_member;
        this.name = data.name;
        this.open = data.open;
        this.owner = data.owner;
    }

    public communityImage(): string {
        if (this.changedImage) {
            return URL.createObjectURL(this.changedImage);
        }

        if (this.hasImage) {
            return BASE_URL + `/communities/${this.id}/image`;
        }

        // ToDo: coger la imagen por defecto de los assets
        return 'https://github.com/Cadiducho/PrognoSports-Frontend/blob/develop/src/assets/default_profile_image.jpg?raw=true';
    }
}