import axios from 'axios';
import {Community} from "@/types/Community";
import {User} from "@/types/User";

export class CommunityService {

    public async getCommunityById(communityId: string | number): Promise<Community> {
        return await axios.get(`/communities/${communityId}`);
    }

    public async getAllCommunities(): Promise<Array<Community>> {
        return await axios.get(`/communities`);
    }

    public async getUserCommunities(user: User): Promise<Array<Community>> {
        return await axios.get(`/user/${user.id}/communities`);
    }

    public async validateUserInCommunity(community: Community): Promise<boolean> {
        return await axios.get(`/communities/${community.id}/validate`);
    }

    public async joinCommunity(community: Community, code?: string): Promise<Community> {
        if (code) {
            return await axios.post(`/communities/${community.id}/join/${code}`);
        } else {
            return await axios.post(`/communities/${community.id}/join`);
        }
    }

    public async quitCommunity(community: Community): Promise<Community> {
        return await axios.post(`/communities/${community.id}/quit`)
    }
}
