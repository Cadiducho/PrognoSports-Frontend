import axios from "axios";
import {Community} from "@/types/Community";
import {GrandPrix} from "@/types/GrandPrix";
import {UserPoints} from "@/types/UserPoints";

export class ScoreService {

    // FixMe: usar tipos
    public async getUserPointsByGP(communityId: number, season: number) {
        return await axios.get(`/communities/${communityId}/${season}/points`);
    }

    // FixMe: usar tipos
    public async getTotalUserPoints(communityId: number, season: number) {
        return await axios.get(`/communities/${communityId}/${season}/totaluserpoints`);
    }

    public async getPointsInGrandPrix(community: Community, gp: GrandPrix): Promise<Array<UserPoints>> {
        return await axios.get(`/communities/${community.id}/${community.competition.id}/${gp.season.id}/points/${gp.id}`)
    }
}