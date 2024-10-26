import {PrognoService} from "@/_services/progno.service";
import {IRaceSession, RaceSession} from "@/types/RaceSession";
import axios from "axios";
import {GrandPrix} from "@/types/GrandPrix";

export class SessionService extends PrognoService<IRaceSession, RaceSession> {

    factory(data: IRaceSession): RaceSession {
        return new RaceSession(data);
    }

    /**
     * Devuelve una sesión
     * @param sessionId
     */
    public async getSession(sessionId: number): Promise<RaceSession> {
        return this.getObjectFromAPI(`/sessions/${sessionId}`)
    }

    /**
     * Devuelve la lista total de RaceSessions
     */
    public async getSessionList(): Promise<Array<RaceSession>> {
        return this.getObjectListFromAPI(`/sessions`)
    }

    /**
     * Crear una sesión
     * @param data los datos de la sesión
     */
    public async createSession(data: Partial<RaceSession>): Promise<RaceSession> {
        return await axios.post(`/sessions`, data)
    }

    /**
     * Actualizar una sesión
     * @param session La sesión con los datos a actualizar
     */
    public async updateSession(session: Partial<RaceSession>): Promise<RaceSession> {
        return await axios.put(`/sessions/${session.id}`, session);
    }

    /**
     * Eliminar una sesión de la base de datos
     * @param session La sesión
     */
    public async deleteSession(session: RaceSession): Promise<boolean> {
        return await axios.delete(`/sessions/${session.id}`)
    }

    public async listSessionsInGrandPrix(gp: GrandPrix): Promise<Array<RaceSession>> {
        return this.getObjectListFromAPI(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/sessions`);
    }

    public async getOneSessionInGrandPrix(gp: GrandPrix, sessionId: number): Promise<RaceSession> {
        return this.getObjectFromAPI(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/sessions/${sessionId}`);
    }

    public async addSessionInGrandPrix(gp: GrandPrix, data: { session: number, date: Date }): Promise<RaceSession> {
        return this.postObjectToAPI(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/sessions`, data);
    }

    public async updateSessionInGrandPrix(gp: GrandPrix, session: RaceSession, data: {
      date: Date;
      defineGridOf: number[]
    }): Promise<Array<RaceSession>> {
        return await axios.put(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/sessions/${session.id}`, data);
    }

    public async removeSessionFromGrandPrix(gp: GrandPrix, session: RaceSession): Promise<Array<RaceSession>> {
        return await axios.delete(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/sessions/${session.id}`);
    }
}
