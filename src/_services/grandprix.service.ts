import axios from "axios";
import {GrandPrix} from "@/types/GrandPrix";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";
import {StartGridPosition} from "@/types/StartGridPosition";
import {RaceSession} from "@/types/RaceSession";
import {RaceResult} from "@/types/RaceResult";
import {User} from "@/types/User";
import {Community} from "@/types/Community";

export class GrandprixService {

    public async getNextGrandPrix(competition: Competition) : Promise<GrandPrix> {
        return await axios.get(`/gps/${competition.code}/next`);
    }

    public async getGrandPrixesList(searchType: string, competition: Competition, season: Season): Promise<Array<GrandPrix>> {
        switch (searchType) {
            case "next":
                return await axios.get(`/gps/${competition.code}/${season.name}/next`);
            case "past":
                return await axios.get(`/gps/${competition.code}/${season.name}/past`);
            default:
                return await axios.get(`/gps/${competition.code}/${season.name}`);
        }
    }

    public async getGrandPrix(competition: Competition, season: Season, id: string): Promise<GrandPrix> {
        return await axios.get(`/gps/${competition.code}/${season.name}/${id}`);
    }

    public async getGrandPrixGrid(competition: Competition, season: Season, gpId: string): Promise<Array<StartGridPosition>> {
        return await axios.get(`/gps/${competition.code}/${season.name}/${gpId}/grid`);
    }

    public async getResults(gp: GrandPrix, session: RaceSession): Promise<Array<RaceResult>> {
        return await axios.get(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/${session}/results`);
    }

    public async getAllTipps(gp: GrandPrix, session: RaceSession, community: Community): Promise<Record<number, Array<RaceResult>>> {
        return await axios.get(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/${session}/tipps/${community.id}`);
    }

    public async getUserTipps(gp: GrandPrix, session: RaceSession, community: Community, user: User): Promise<Map<number, Array<RaceResult>>> {
        return await axios.get(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/${session}/tipps/${community.id}/${user.id}`);
    }

    public async postUserTipps(gp: GrandPrix, session: RaceSession, community: Community, tipps: Array<RaceResult>): Promise<string> {
        return await axios.post(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/${session}/tipps/${community.id}`, {tipps: tipps});
    }
}