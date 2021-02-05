import {User} from "@/types/User";

export interface CommunityUser {
    community: User;
    user: User;

    isUserInCommunity: boolean;
    can_modify_permissions: boolean;
    can_recreate_invitation: boolean;
    can_kick_users: boolean;
}