import {getObject, getObjectList, postObject} from "@/_services/api";
import axios from 'axios';
import {Community, mapCommunity} from "@/types/Community";
import {CommunityUser, CommunityUserDto, mapCommunityUser} from "@/types/CommunityUser";

export interface CreateCommunityPayload {
    name: string;
    description: string;
    image_url: string;
    owner: number;
    open: boolean;
    default_rule_set: number;
}

export class CommunityService {
    public async getCommunityById(communityId: string | number): Promise<Community> {
        return getObject(`/communities/${communityId}`, mapCommunity);
    }

    public async getAllCommunities(): Promise<Array<Community>> {
        return getObjectList("/communities", mapCommunity);
    }

    public async getUserCommunities(userId: number): Promise<Array<Community>> {
        return getObjectList(`/user/${userId}/communities`, mapCommunity);
    }

    public async joinCommunity(community: Community, code?: string): Promise<Community> {
        const searchParameter = (code ? `/${code}` : "");
        return postObject(`/communities/${community.name}/join${searchParameter}`, undefined, mapCommunity);
    }

    public async quitCommunity(community: Community): Promise<Community> {
        return await axios.post(`/communities/${community.id}/quit`)
    }

    public async getMembers(communityId: number): Promise<Array<CommunityUser>> {
        const userData = await axios.get(`/communities/${communityId}/members`) as CommunityUserDto[];
        return userData.map(mapCommunityUser);
    }

    public async createCommunity(data: CreateCommunityPayload): Promise<Community> {
        return postObject(`/communities`, data, mapCommunity);
    }
}
