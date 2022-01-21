import axios from "axios";
import {GrandPrix} from "@/types/GrandPrix";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";
import {StartGridPosition} from "@/types/StartGridPosition";
import {RaceSession} from "@/types/RaceSession";
import {RaceResult} from "@/types/RaceResult";
import {User} from "@/types/User";
import {Community} from "@/types/Community";
import {Dictionary} from "@/types/Dictionary";

export class GrandprixService {

    public async getNextGrandPrix(competition: Competition) : Promise<GrandPrix> {
        return await axios.get(`/gps/${competition.code}/next`);
    }

    public async getGrandPrixesList(searchType: string, competition: Competition, season: Season): Promise<Array<GrandPrix>> {
        let comp = competition.id ?? competition.code;
        let seas = season.id ?? season.name;
        let searchParameter = (searchType === "all" ? "" : `/${searchType}` );

        return await axios.get(`/gps/${comp}/${seas}${searchParameter}`);
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

    public async getUserTipps(gp: GrandPrix, session: RaceSession, community: Community, user: User): Promise<Dictionary<number, RaceResult>> {
        return await axios.get(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/${session}/tipps/${community.id}/${user.id}`);
    }

    public async postUserTipps(gp: GrandPrix, session: RaceSession, community: Community, tipps: Array<RaceResult>): Promise<string> {
        return await axios.post(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/${session}/tipps/${community.id}`, {tipps: tipps});
    }
}