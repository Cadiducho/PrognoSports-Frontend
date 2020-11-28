import axios from "axios";
import {GrandPrix} from "@/types/GrandPrix";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";
import {StartGridPosition} from "@/types/StartGridPosition";

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

    public async getTipps(gp: GrandPrix, communityId: number) {
        return await axios.get(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/qualiTipps/${communityId}`);
    }
}