import axios from "axios";
import {Community} from "@/types/Community";
import {GrandPrix} from "@/types/GrandPrix";
import {UserPoints} from "@/types/UserPoints";
import {RaceSession} from "@/types/RaceSession";
import {Dictionary} from "@/types/Dictionary";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";
import {User} from "@/types/User";

export class ScoreService {

    /**
     * Devuelve un map del estilo:
     *
     * "Australian Grand Prix": {
     *     "michael": 60,
     *     "fernando": 25
     *  },
     *  "Bahrein..."
     * @param community
     * @param competition
     * @param season
     */
    public async getUserPointsByGP(community: Community, competition: Competition, season: Season): Promise<Dictionary<string, Dictionary<string, UserPoints>>> {
        return await axios.get(`/communities/${community.id}/${competition.id}/${season.id}/points`);
    }

    /**
     * Devuelve un map de {username -> puntos totales}
     * @param community
     * @param competition
     * @param season
     */
    public async getTotalUserPoints(community: Community, competition: Competition, season: Season): Promise<Dictionary<string, number>> {
        return await axios.get(`/communities/${community.id}/${competition.id}/${season.id}/totaluserpoints`);
    }

    public async getPointsInGrandPrix(community: Community, gp: GrandPrix): Promise<Array<UserPoints>> {
        return await axios.get(`/communities/${community.id}/${community.competition.id}/${gp.season.id}/points/${gp.id}`);
    }

    public async getPointsByPositionInGrandPrix(community: Community, gp: GrandPrix, session: RaceSession): Promise<Dictionary<number, Dictionary<number, number>>> {
        return await axios.get(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/${session}/tipps/${community.id}/calculations`);
    }
}