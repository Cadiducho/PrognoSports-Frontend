import axios from "axios";
import {GrandPrix} from "@/types/GrandPrix";
import {Driver} from "@/types/Driver";
import {Season} from "@/types/Season";
import {Dictionary} from "@/types/Dictionary";
import {SeasonMembership} from "@/_services/seasonMembership";

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
     * Crea un piloto. Devuelve el piloto con su id generado.
     */
    public async createDriver(data: CreateDriverData): Promise<Driver> {
        return await axios.post(`/drivers`, data);
    }

    public async updateDriver(driver: Pick<Driver, "id" | "firstname" | "lastname" | "code" | "nationality" | "birth">): Promise<Driver> {
        return await axios.put(`/drivers/${driver.id}`, {
            firstname: driver.firstname,
            lastname: driver.lastname,
            code: driver.code,
            nationality: driver.nationality,
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
     * Un piloto con sus datos en una temporada (dorsal y color)
     */
    public async getDriverInSeason(seasonId: string | number, driverId: string | number): Promise<Driver> {
        return await axios.get(`/seasons/${seasonId}/drivers/${driverId}`);
    }

    /**
     * Temporadas en las que participa un piloto, con sus datos en cada una (dorsal y color)
     */
    public async getSeasonMembershipsOfDriver(driverId: number): Promise<Array<SeasonMembership<Driver>>> {
        return await axios.get(`/drivers/${driverId}/seasons`);
    }
}
