import {Competition} from "@/types/Competition";
import axios from "axios";
import {Season} from "@/types/Season";

export class SeasonService {

    public async getCurrentSeason(competition: Competition) : Promise<Season> {
        return await axios.get(`/seasons/current/${competition.code ?? competition.name ?? competition.id}`);
    }

    public async getSeason(seasonId: string): Promise<Season> {
        return await axios.get(`/seasons/${seasonId}`)
    }

    public async getSeasonList(): Promise<Array<Season>> {
        return await axios.get(`/seasons`)
    }

    public async createSeason(data: any): Promise<Season> {
        return await axios.post(`/seasons`, data)
    }

    public async editSeason(season: Season, data: { totalEvents: number; name: string; competition: number }): Promise<Season> {
        return await axios.put(`/seasons/${season.id}`, data)
    }

    public async deleteSeason(season: Season): Promise<boolean> {
        return await axios.delete(`/seasons/${season.id}`)
    }
}