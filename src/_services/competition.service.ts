import {getObject, getObjectList} from "@/_services/api";
import {Competition, mapCompetition} from "@/types/Competition";
import axios from "axios";
import {Season} from "@/types/Season";

export class CompetitionService {
    public async getCompetition(competitionId: string | number): Promise<Competition> {
        return getObject(`/competitions/${competitionId}`, mapCompetition)
    }

    public async getCompetitionList(): Promise<Array<Competition>> {
        return getObjectList(`/competitions`, mapCompetition)
    }

    public async getSeasonsOfCompetition(competition: Competition): Promise<Array<Season>> {
        return await axios.get(`/competitions/${competition.id}/seasons`)
    }

    public async createCompetition(data: { code: string, name: string, fullname: string, rules: string }): Promise<Competition> {
        return await axios.post(`/competitions`, data)
    }

    public async editCompetition(competition: Competition, data: { code: string; name: string; fullname: string, rules: string, currentSeason: number }): Promise<Competition> {
        return await axios.put(`/competitions/${competition.id}`, data)
    }

    public async deleteCompetition(competition: Competition): Promise<boolean> {
        return await axios.delete(`/competitions/${competition.id}`)
    }
}