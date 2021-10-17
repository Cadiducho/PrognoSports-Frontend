import {Competition} from "@/types/Competition";
import axios from "axios";
import {Season} from "@/types/Season";
import {Circuit} from "@/types/Circuit";

export class CompetitionService {

    public async getCompetition(competitionId: string) {
        return await axios.get(`/competitions/${competitionId}`)
    }

    public async getCompetitionList(): Promise<Array<Competition>> {
        return await axios.get(`/competitions`)
    }
}