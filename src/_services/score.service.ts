import axios from "axios";
import {Community} from "@/types/Community";
import {GrandPrix} from "@/types/GrandPrix";
import {UserPoints} from "@/types/UserPoints";
import {RaceSession} from "@/types/RaceSession";
import {Dictionary} from "@/types/Dictionary";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";
import {ScoreCalculations} from "@/types/ScoreCalculations";

export class ScoreService {

    /**
     * Devuelve un map del estilo:
     *
     * "3": {
     *     "michael": 60,
     *     "fernando": 25
     *  },
     *  "5..."
     *  Siendo 3, 5 etc. la ID del Gran Premio
     * @param community la comunidad en la que consultar
     * @param season la temporada en la que consultar
     */
    public async getUserPointsByGP(community: Community, season: Season): Promise<Dictionary<string, Dictionary<string, UserPoints>>> {
        const competition = {id: 1} as Competition; // ToDo: Remove from API
        return await axios.get(`/communities/${community.id}/${competition.id}/${season.id}/points`);
    }

    /**
     * Devuelve un map de {username -> puntos totales}
     * @param community
     * @param season
     */
    public async getTotalUserPoints(community: Community, season: Season): Promise<Dictionary<string, number>> {
        const competition = {id: 1} as Competition; // ToDo: Remove from API
        return await axios.get(`/communities/${community.id}/${competition.id}/${season.id}/totaluserpoints`);
    }

    public async getPointsInGrandPrix(community: Community, gp: GrandPrix): Promise<Array<UserPoints>> {
        return await axios.get(`/communities/${community.id}/${community.competition.id}/${gp.season.id}/points/${gp.id}`);
    }

    public async getPointsByPositionInGrandPrix(community: Community, gp: GrandPrix, session: RaceSession): Promise<ScoreCalculations> {
        return await axios.get(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/sessions/${session.id}/tipps/${community.id}/calculations`);
    }

    public async getPointsByPositionInGrandPrixSimulated(community: Community, gp: GrandPrix, session: RaceSession, results: Map<number, string>): Promise<ScoreCalculations> {
        const resultsObject: Dictionary<number, string> = {};
        results.forEach((value, key) => {
            resultsObject[key] = value;
        });
        return await axios.post(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/sessions/${session.id}/tipps/${community.id}/calculations`, { results: resultsObject });
    }
}
