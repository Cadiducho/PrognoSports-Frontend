import {IUser, User} from "@/types/User";
import {Community, ICommunity} from "@/types/Community";

export interface ICommunityUser {
    community?: ICommunity;
    user: IUser;

    isUserInCommunity: boolean;
    can_modify_permissions: boolean;
    can_recreate_invitation: boolean;
    can_kick_users: boolean;
}

export class CommunityUser implements ICommunityUser {
    community?: Community;
    user: User;

    isUserInCommunity: boolean;
    can_modify_permissions: boolean;
    can_recreate_invitation: boolean;
    can_kick_users: boolean;

    constructor(data: ICommunityUser) {
        this.can_kick_users = data.can_kick_users;
        this.can_modify_permissions = data.can_modify_permissions;
        this.can_recreate_invitation = data.can_recreate_invitation;
        if (data.community) this.community = new Community(data.community);
        this.isUserInCommunity = data.isUserInCommunity;
        this.user = new User(data.user);
    }
}