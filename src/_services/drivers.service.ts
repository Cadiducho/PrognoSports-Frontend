import axios from "axios";
import {GrandPrix} from "@/types/GrandPrix";
import {Driver} from "@/types/Driver";
import {Season} from "@/types/Season";

export class DriversService {

    public async getAllDrivers(): Promise<Array<Driver>> {
        return await axios.get(`/drivers`);
    }

    public async getDriversInGrandPrix(gp: GrandPrix): Promise<Array<Driver>> {
        return await axios.get(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/drivers`);
    }

    public async getDriversInSeason(season: Season): Promise<Array<Driver>> {
        return await axios.get(`/seasons/${season.id}/drivers`);
    }

    public async createDriver(rawDriver: { firstname: string; code: string; nationality: string; id: string; lastname: string, birth: Date }): Promise<Driver> {
        return await axios.post(`/drivers`, rawDriver);
    }
}
