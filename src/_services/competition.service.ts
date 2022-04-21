import {Competition, ICompetition} from "@/types/Competition";
import axios from "axios";
import {Season} from "@/types/Season";
import {PrognoService} from "@/_services/progno.service";

export class CompetitionService extends PrognoService<ICompetition, Competition> {

    factory(data: ICompetition): Competition {
        return new Competition(data);
    }

    public async getCompetition(competitionId: string): Promise<Competition> {
        return this.getObjectFromAPI(`/competitions/${competitionId}`)
    }

    public async getCompetitionList(): Promise<Array<Competition>> {
        return this.getObjectListFromAPI(`/competitions`)
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