import axios from "axios";
import {Community} from "@/types/Community";
import {GrandPrix} from "@/types/GrandPrix";
import {UserPoints} from "@/types/UserPoints";
import {RaceSession} from "@/types/RaceSession";
import {Dictionary} from "@/types/Dictionary";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";

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

    public async getPointsByPositionInGrandPrix(community: Community, gp: GrandPrix, session: RaceSession): Promise<Dictionary<number, Dictionary<number, number>>> {
        return await axios.get(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/sessions/${session.id}/tipps/${community.id}/calculations`);
    }
}