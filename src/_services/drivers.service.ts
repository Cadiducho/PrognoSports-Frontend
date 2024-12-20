import axios from "axios";
import {GrandPrix} from "@/types/GrandPrix";
import {Driver} from "@/types/Driver";
import {Season} from "@/types/Season";
import {Dictionary} from "@/types/Dictionary";

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

    public async createDriver(rawDriver: { firstname: string; code: string; nationality: string; id: string; lastname: string, birth: Date }): Promise<Driver> {
        return await axios.post(`/drivers`, rawDriver);
    }

    public async updateDriver(driver: Driver): Promise<Driver> {
        return await axios.put(`/drivers/${driver.id}`, driver);
    }

    public async deleteDriver(driver: Driver) {
        return await axios.delete(`/drivers/${driver.id}`);
    }

    public async getDriver(id: string): Promise<Driver> {
        return await axios.get(`/drivers/${id}`);
    }
}
