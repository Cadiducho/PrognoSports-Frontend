import axios from "axios";
import {GrandPrix} from "@/types/GrandPrix";
import {Driver} from "@/types/Driver";
import {Season} from "@/types/Season";
import {Dictionary} from "@/types/Dictionary";
import {SeasonMembership, findSeasonMemberships, sameText} from "@/_services/seasonMembership";

export interface CreateDriverData {
    firstname: string;
    lastname: string;
    code: string;
    nationality: string;
    birth: Date;
}

export class DriversService {

    public async getAllDrivers(): Promise<Array<Driver>> {
        return await axios.get(`/drivers`);
    }

    public async getDriversInGrandPrix(gp: GrandPrix): Promise<Array<Driver>> {
        return await axios.get(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/drivers`);
    }

    public async setDriversInGrandPrix(gp: GrandPrix, drivers: Dictionary<string, Array<Driver>>) {
        return await axios.put(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/drivers`, drivers);
    }

    public async getDriversInSeason(season: Season): Promise<Array<Driver>> {
        return await axios.get(`/seasons/${season.id}/drivers`);
    }

    /**
     * Crea un piloto y lo devuelve siempre con su id.
     */
    public async createDriver(data: CreateDriverData): Promise<Driver> {
        const created: Driver = await axios.post(`/drivers`, data);
        if (created?.id != undefined) {
            return created;
        }

        // TODO(Cadiducho/PrognoSports#241): quitar cuando el POST devuelva el id generado.
        // Nombre + apellido es único en base de datos.
        const found = (await this.getAllDrivers())
            .find(driver => sameText(driver.firstname, data.firstname) && sameText(driver.lastname, data.lastname));
        if (!found) {
            throw {message: "El piloto se ha creado, pero no se ha podido recuperar su id"};
        }
        return found;
    }

    public async updateDriver(driver: Pick<Driver, "id" | "firstname" | "lastname" | "code" | "nationality" | "birth">): Promise<Driver> {
        return await axios.put(`/drivers/${driver.id}`, {
            firstname: driver.firstname,
            lastname: driver.lastname,
            code: driver.code,
            nationality: driver.nationality,
            // TODO(Cadiducho/PrognoSports#241): el backend lee `nacionality` en el PUT
            nacionality: driver.nationality,
            birth: driver.birth,
        });
    }

    public async deleteDriver(driver: Driver) {
        return await axios.delete(`/drivers/${driver.id}`);
    }

    public async deleteDriversInSeason(season: Season, driver: Pick<Driver, "id">) {
        return await axios.delete(`/seasons/${season.id}/drivers/${driver.id}`);
    }

    public async linkDriverToSeason(season: Pick<Season, "id">, rawData: {driver: number, color: string, number: number}): Promise<Driver> {
        return await axios.post(`/seasons/${season.id}/drivers`, rawData);
    }

    public async updateDriverInSeason(seasonId: string | number, driverId: string | number, data: {color?: string, number?: number}): Promise<Driver> {
        return await axios.put(`/seasons/${seasonId}/drivers/${driverId}`, data);
    }

    public async getDriver(id: string | number): Promise<Driver> {
        return await axios.get(`/drivers/${id}`);
    }

    /**
     * Temporadas en las que participa un piloto, con sus datos en cada una (dorsal y color).
     * El backend no tiene endpoint para esto, así que se consulta cada temporada.
     */
    public async getSeasonsOfDriver(driverId: number): Promise<Array<SeasonMembership<Driver>>> {
        return findSeasonMemberships(season => this.getDriversInSeason(season), driverId);
    }
}
