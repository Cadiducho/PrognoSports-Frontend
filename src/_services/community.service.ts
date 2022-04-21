import axios from 'axios';
import {Community, ICommunity} from "@/types/Community";
import {User} from "@/types/User";
import {CommunityUser} from "@/types/CommunityUser";
import {PrognoService} from "@/_services/progno.service";

export class CommunityService extends PrognoService<ICommunity, Community> {

    factory(data: ICommunity): Community {
        return new Community(data);
    }

    public async getCommunityById(communityId: string | number): Promise<Community> {
        return this.getObjectFromAPI(`/communities/${communityId}`);
    }

    public async getAllCommunities(): Promise<Array<Community>> {
        return this.getObjectListFromAPI("/communities");
    }

    public async getUserCommunities(user: User): Promise<Array<Community>> {
        return this.getObjectListFromAPI(`/user/${user.id}/communities`);
    }

    public async joinCommunity(community: Community, code?: string): Promise<Community> {
        const searchParameter = (code ? `/${code}` : "");
        return await axios.post(`/communities/${community.name}/join${searchParameter}`);
    }

    public async quitCommunity(community: Community): Promise<Community> {
        return await axios.post(`/communities/${community.id}/quit`)
    }

    public async getMembers(community: Community): Promise<Array<CommunityUser>> {
        return await axios.get(`/communities/${community.id}/members`)
    }

    public async createCommunity(data: any): Promise<Community> {
        return await axios.post(`/communities`, data)
    }
}
