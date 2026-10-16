import {getObject, getObjectList, postObject} from "@/_services/api";
import {Competition} from "@/types/Competition";
import axios from "axios";
import {mapSeason, Season} from "@/types/Season";

export class SeasonService {

    public async getCurrentSeason(competition: Competition) : Promise<Season> {
        return getObject(`/seasons/current/${competition.code ?? competition.name ?? competition.id}`, mapSeason);
    }

    public async getSeason(seasonId: string): Promise<Season> {
        return getObject(`/seasons/${seasonId}`, mapSeason);
    }

    public async getSeasonList(): Promise<Array<Season>> {
        return getObjectList(`/seasons`, mapSeason);
    }

    public async createSeason(data: { name: string; totalEvents: number; competition: number }): Promise<Season> {
        return postObject(`/seasons`, data, mapSeason);
    }

    public async editSeason(season: Season, data: { totalEvents: number; name: string; competition: number }): Promise<Season> {
        return await axios.put(`/seasons/${season.id}`, data)
    }

    public async deleteSeason(season: Season): Promise<boolean> {
        return await axios.delete(`/seasons/${season.id}`)
    }
}
