import axios from 'axios';
import {Community} from "@/types/Community";
import {User} from "@/types/User";

export class CommunityService {
    public async getCurrentCommunity(communityId: number): Promise<Community> {
        return await axios.get(`/communities/${communityId}`);
    }

    public async getUserPointsByGP(communityId: number, season: number) {
        return await axios.get(`/communities/${communityId}/${season}/points`);
    }

    public async getUserCummulatedPointsByGP(communityId: number, season: number) {
        return await axios.get(`/communities/${communityId}/${season}/cummulatedpoints`);
    }

    public async getTotalUserPoints(communityId: number, season: number) {
        return await axios.get(`/communities/${communityId}/${season}/totaluserpoints`);
    }

    public async getUserCommunities(user: User): Promise<Array<Community>> {
        return await axios.get(`/user/${user.id}/communities`);
    }
}
