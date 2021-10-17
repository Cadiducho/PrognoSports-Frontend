import {Competition} from "@/types/Competition";
import axios from "axios";
import {Season} from "@/types/Season";
import {Circuit} from "@/types/Circuit";

export class SeasonService {

    public async getCurrentSeason(competition: Competition) : Promise<Season> {
        return await axios.get(`/seasons/current/f1`); //fixme
    }

    public async getSeason(seasonId: number): Promise<Season> {
        return await axios.get(`/seasons/${seasonId}`)
    }

    public async getSeasonList(): Promise<Array<Season>> {
        return await axios.get(`/seasons`)
    }

    public async createSeason(data: any): Promise<Season> {
        return await axios.post(`/seasons`, data)
    }
}