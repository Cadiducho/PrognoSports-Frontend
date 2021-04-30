import axios from "axios";
import {Community} from "@/types/Community";
import {GrandPrix} from "@/types/GrandPrix";
import {UserPoints} from "@/types/UserPoints";
import {RaceSession} from "@/types/RaceSession";
import {Dictionary} from "@/types/Dictionary";

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
        return await axios.get(`/communities/${community.id}/${community.competition.id}/${gp.season.id}/points/${gp.id}`);
    }

    public async getPointsByPositionInGrandPrix(community: Community, gp: GrandPrix, session: RaceSession): Promise<Dictionary<number, Dictionary<number, number>>> {
        return await axios.get(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/${session}/tipps/${community.id}/calculations`);
    }
}