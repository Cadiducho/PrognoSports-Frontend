import {getObject, getObjectList} from "@/_services/api";
import axios from 'axios';
import {Community, mapCommunity} from "@/types/Community";
import {User} from "@/types/User";
import {CommunityUser, CommunityUserDto, mapCommunityUser} from "@/types/CommunityUser";

export class CommunityService {
    public async getCommunityById(communityId: string | number): Promise<Community> {
        return getObject(`/communities/${communityId}`, mapCommunity);
    }

    public async getAllCommunities(): Promise<Array<Community>> {
        return getObjectList("/communities", mapCommunity);
    }

    public async getUserCommunities(user: User): Promise<Array<Community>> {
        return getObjectList(`/user/${user.id}/communities`, mapCommunity);
    }

    public async joinCommunity(community: Community, code?: string): Promise<Community> {
        const searchParameter = (code ? `/${code}` : "");
        return await axios.post(`/communities/${community.name}/join${searchParameter}`);
    }

    public async quitCommunity(community: Community): Promise<Community> {
        return await axios.post(`/communities/${community.id}/quit`)
    }

    public async getMembers(community: Community): Promise<Array<CommunityUser>> {
        const userData = await axios.get(`/communities/${community.id}/members`) as CommunityUserDto[];
        return userData.map(mapCommunityUser);
    }

    public async createCommunity(data: any): Promise<Community> {
        return await axios.post(`/communities`, data)
    }
}
