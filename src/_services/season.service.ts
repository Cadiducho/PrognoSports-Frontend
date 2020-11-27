import {Competition} from "@/types/Competition";
import axios from "axios";
import {Season} from "@/types/Season";

export class SeasonService {

    public async getCurrentSeason(competition: Competition) : Promise<Season> {
        return await axios.get(`/seasons/current/f1`);
    }

    public async getSeason(seasonId: number) {
        return await axios.get(`/seasons/${seasonId}`)
    }

    public async getSeasonList() {
        return await axios.get(`/seasons`)
    }
}