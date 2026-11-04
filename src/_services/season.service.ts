import {Competition} from "@/types/Competition";
import axios from "axios";
import {Season} from "@/types/Season";
import {sameText} from "@/_services/seasonMembership";

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

    /**
     * Crea una temporada y la devuelve siempre con su id.
     */
    public async createSeason(data: { name: string; totalEvents: number; competition: number }): Promise<Season> {
        const created: Season = await axios.post(`/seasons`, data);
        if (created?.id != undefined) {
            return created;
        }

        // TODO(Cadiducho/PrognoSports#241): quitar cuando el POST devuelva el id generado.
        const found = (await this.getSeasonList())
            .find(season => sameText(season.name, data.name) && season.competition?.id === data.competition);
        if (!found) {
            throw {message: "La temporada se ha creado, pero no se ha podido recuperar su id"};
        }
        return found;
    }

    public async editSeason(season: Season, data: { totalEvents: number; name: string; competition: number }): Promise<Season> {
        return await axios.put(`/seasons/${season.id}`, data)
    }

    public async deleteSeason(season: Season): Promise<boolean> {
        return await axios.delete(`/seasons/${season.id}`)
    }
}
