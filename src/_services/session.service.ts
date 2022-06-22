import {PrognoService} from "@/_services/progno.service";
import {IRaceSession, RaceSession} from "@/types/RaceSession";
import axios from "axios";

export class SessionService extends PrognoService<IRaceSession, RaceSession> {

    factory(data: IRaceSession): RaceSession {
        return new RaceSession(data);
    }

    /**
     * Devuelve una sesión. RACE, QUALIFY...
     * @param sessionName
     */
    public async getSession(sessionName: string): Promise<RaceSession> {
        return this.getObjectFromAPI(`/sessions/${sessionName}`)
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
        return await axios.put(`/sessions/${session.name}`, session);
    }

    /**
     * Eliminar una sesión de la base de datos
     * @param session La sesión
     */
    public async deleteSession(session: RaceSession): Promise<boolean> {
        return await axios.delete(`/sessions/${session.name}`)
    }
}