import axios from "axios";
import {GrandPrix, IGrandPrix} from "@/types/GrandPrix";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";
import {StartGridPosition} from "@/types/StartGridPosition";
import {RaceSession} from "@/types/RaceSession";
import {RaceResult} from "@/types/RaceResult";
import {User} from "@/types/User";
import {Community} from "@/types/Community";
import {Dictionary} from "@/types/Dictionary";
import {PrognoService} from "@/_services/progno.service";
import {Circuit} from "@/types/Circuit";
import {CircuitVariant} from "@/types/CircuitVariant";

export class GrandprixService extends PrognoService<IGrandPrix, GrandPrix> {

    factory(data: IGrandPrix): GrandPrix {
        return new GrandPrix(data);
    }

    public async getNextGrandPrix(competition: Competition) : Promise<GrandPrix> {
        return this.getObjectFromAPI(`/gps/${competition.code}/next`);
    }

    public async getGrandPrixesList(competition: Competition, season: Season, searchType: string = 'all'): Promise<Array<GrandPrix>> {
        let comp = competition.id ?? competition.code;
        let seas = season.id ?? season.name;
        let searchParameter = (searchType === "all" ? "" : `/${searchType}` );

        return this.getObjectListFromAPI(`/gps/${comp}/${seas}${searchParameter}`);
    }

    public async getGPThatUsesCircuit(circuit: Circuit, variant: CircuitVariant): Promise<Array<GrandPrix>> {
        return this.getObjectListFromAPI(`/circuits/${circuit.id}/${variant.name}/gps`);
    }

    public async getGrandPrix(competition: Competition, season: Season, id: string): Promise<GrandPrix> {
        return this.getObjectFromAPI(`/gps/${competition.code}/${season.name}/${id}`);
    }

    public async createGrandPrix(data: { code: string; circuit: string; round: number; promo_image_url: string; name: string; variant: string; season: number; competition: number; laps: number; id: string }): Promise<GrandPrix> {
        return await axios.post(`/gps/`, data);
    }

    public async editGrandPrix(data: {id: string, season: number, competition: number, round: number, name: string, code: string,
        circuit: string, variant: string, promo_image_url: string, laps: number}): Promise<GrandPrix> {
        return await axios.put(`/gps/${data.competition}/${data.season}/${data.id}/`, data);
    }

    public async getGrandPrixGrid(grandPrix: GrandPrix, session: RaceSession): Promise<Array<StartGridPosition>> {
        return await axios.get(`/gps/${grandPrix.competition.code}/${grandPrix.season.name}/${grandPrix.id}/grid/${session.name}`);
    }

    public async getResults(gp: GrandPrix, session: RaceSession): Promise<Array<RaceResult>> {
        return await axios.get(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/${session.name}/results`);
    }

    public async getAllTipps(gp: GrandPrix, session: RaceSession, community: Community): Promise<Record<number, Array<RaceResult>>> {
        return await axios.get(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/${session.name}/tipps/${community.id}`);
    }

    public async getUserTipps(gp: GrandPrix, session: RaceSession, community: Community, user: User): Promise<Dictionary<number, RaceResult>> {
        return await axios.get(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/${session.name}/tipps/${community.id}/${user.id}`);
    }

    public async postUserTipps(gp: GrandPrix, session: RaceSession, community: Community, tipps: Array<RaceResult>): Promise<string> {
        return await axios.post(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/${session.name}/tipps/${community.id}`, {tipps: tipps});
    }
}