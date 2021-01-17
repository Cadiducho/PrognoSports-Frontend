import axios from 'axios';
import {Community} from "@/types/Community";
import {User} from "@/types/User";

export class CommunityService {

    public async getCommunityById(communityId: number): Promise<Community> {
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

    //ToDo: mover a score
    public async getUserPointsByGP(communityId: number, season: number) {
        return await axios.get(`/communities/${communityId}/${season}/points`);
    }

    //ToDo: mover a score
    public async getTotalUserPoints(communityId: number, season: number) {
        return await axios.get(`/communities/${communityId}/${season}/totaluserpoints`);
    }

}
