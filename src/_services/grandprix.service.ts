import {getObject, getObjectList} from "@/_services/api";
import axios from "axios";
import {GrandPrix, mapGrandPrix} from "@/types/GrandPrix";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";
import {StartGridPosition} from "@/types/StartGridPosition";
import {RaceSession} from "@/types/RaceSession";
import {RaceResult} from "@/types/RaceResult";
import {User} from "@/types/User";
import {Community} from "@/types/Community";
import {Dictionary} from "@/types/Dictionary";
import {Circuit} from "@/types/Circuit";
import {CircuitVariant} from "@/types/CircuitVariant";

export class GrandprixService {
    public async getNextGrandPrix(competition: Competition): Promise<GrandPrix> {
        return getObject(`/gps/${competition.code}/next`, mapGrandPrix);
    }

    public async getAllGrandPrixes(): Promise<Array<GrandPrix>> {
        return getObjectList(`/gps`, mapGrandPrix);
    }

    public async getGrandPrixesList(season: Season): Promise<Array<GrandPrix>> {
        let comp = 1; // ToDo: Remove from API
        let seas = season.id ?? season.name;

        return getObjectList(`/gps/${comp}/${seas}`, mapGrandPrix);
    }

    public async getGPThatUsesCircuit(circuit: Circuit): Promise<Array<GrandPrix>> {
        return getObjectList(`/circuits/${circuit.id}/gps`, mapGrandPrix);
    }

    public async getGPThatUsesCircuitVariant(circuit: Circuit, variant: CircuitVariant): Promise<Array<GrandPrix>> {
        return getObjectList(`/circuits/${circuit.id}/${variant.name}/gps`, mapGrandPrix);
    }

    public async getGrandPrix(grandPrixId: string): Promise<GrandPrix> {
        return getObject(`/gps/${grandPrixId}`, mapGrandPrix);
    }

    public async getGrandPrixInSeason(season: Season, id: string): Promise<GrandPrix> {
        let comp = 1;  // ToDo: Remove from API
        let seas = season.id ?? season.name;

        return getObject(`/gps/${comp}/${seas}/${id}`, mapGrandPrix);
    }

    public async linkGrandPrixToSeason(seasonId: string, data: {gp: number, circuit: number, variant: number, laps: number, round: number}) {
      return await axios.post(`/seasons/${seasonId}/gps`, data);
    }

    public async createGrandPrix(data: { name: string, code: string }): Promise<GrandPrix> {
        return await axios.post(`/gps/`, data);
    }

    public async editGrandPrix(data: {id: string, name: string, code: string}): Promise<GrandPrix> {
        return await axios.put(`/gps/${data.id}`, data);
    }

    public async editGrandPrixInSeason(data: {id: number, season: number, competition: number, round: number, name: string, code: string,
        circuit: number, variant: string, laps: number, suspended: boolean}): Promise<GrandPrix> {
        return await axios.put(`/gps/${data.competition}/${data.season}/${data.id}`, data);
    }

    public async changePromoImage(grandPrix: GrandPrix, blob: Blob | string) {
        const formData = new FormData();
        formData.append('image', blob);
        return await axios.post(`/gps/${grandPrix.competition.code}/${grandPrix.season.name}/${grandPrix.id}/image`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }

    public async getGrandPrixGrid(grandPrix: GrandPrix, session: RaceSession): Promise<Array<StartGridPosition>> {
        return await axios.get(`/gps/${grandPrix.competition.code}/${grandPrix.season.id}/${grandPrix.id}/sessions/${session.id}/grid`);
    }

    public async getResults(gp: GrandPrix, session: RaceSession): Promise<Array<RaceResult>> {
        return await axios.get(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/sessions/${session.id}/results`);
    }

    public async saveResults(gp: GrandPrix, session: RaceSession, payload: {results: Map<number, string>, notSendNotification: boolean}): Promise<Array<RaceResult>> {
        const realPayload = {
            results: Object.fromEntries(payload.results!),
            notSendNotification: payload.notSendNotification,
        }
        return await axios.post(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/sessions/${session.id}/results`, realPayload);
    }

    public async saveGrid(gp: GrandPrix, session: RaceSession, payload: { grid: { note: string | undefined; isFromPit: boolean; driver: string; position: number }[] } ): Promise<boolean> {
        return await axios.patch(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/sessions/${session.id}/grid`, payload);
    }

    public async getAllTipps(gp: GrandPrix, session: RaceSession, community: Community): Promise<Record<number, Array<RaceResult>>> {
        return await axios.get(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/sessions/${session.id}/tipps/${community.id}`);
    }

    public async getUserTipps(gp: GrandPrix, session: RaceSession, community: Community, user: User): Promise<Dictionary<number, RaceResult>> {
        return await axios.get(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/sessions/${session.id}/tipps/${community.id}/${user.id}`);
    }

    public async postUserTipps(gp: GrandPrix, session: RaceSession, community: Community, tipps: Array<RaceResult>): Promise<string> {
        return await axios.post(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/sessions/${session.id}/tipps/${community.id}`, {tipps: tipps});
    }

    public async deleteGrandPrix(gp: GrandPrix): Promise<string> {
        return await axios.delete(`/gps/${gp.id}`);
    }
}
