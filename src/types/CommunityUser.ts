import {Community, CommunityDto, mapCommunity} from "@/types/Community";
import {mapUser, User, UserDto} from "@/types/User";

export interface CommunityUserDto {
    community?: CommunityDto;
    user: UserDto;

    isUserInCommunity: boolean;
    can_modify_permissions: boolean;
    can_recreate_invitation: boolean;
    can_kick_users: boolean;
}

export interface CommunityUser {
    community?: Community;
    user: User;

    isUserInCommunity: boolean;
    can_modify_permissions: boolean;
    can_recreate_invitation: boolean;
    can_kick_users: boolean;
}

export function mapCommunityUser(dto: CommunityUserDto): CommunityUser {
    return {
        community: dto.community ? mapCommunity(dto.community) : undefined,
        user: mapUser(dto.user),
        isUserInCommunity: dto.isUserInCommunity,
        can_modify_permissions: dto.can_modify_permissions,
        can_recreate_invitation: dto.can_recreate_invitation,
        can_kick_users: dto.can_kick_users,
    };
}
