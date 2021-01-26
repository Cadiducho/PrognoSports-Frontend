import axios from "axios";

export class ScoreService {

    public async getUserPointsByGP(communityId: number, season: number) {
        return await axios.get(`/communities/${communityId}/${season}/points`);
    }

    public async getTotalUserPoints(communityId: number, season: number) {
        return await axios.get(`/communities/${communityId}/${season}/totaluserpoints`);
    }
}