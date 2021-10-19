import axios from "axios";
import {GrandPrix} from "@/types/GrandPrix";
import {Driver} from "@/types/Driver";

export class DriversService {

    public async getDriversInGrandPrix(gp: GrandPrix): Promise<Array<Driver>> {
        return await axios.get(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/drivers`);
    }

    public async createDriver(rawDriver: { firstname: string; code: string; nationality: string; id: string; lastname: string, birth: Date }): Promise<Driver> {
        return await axios.post(`/drivers`, rawDriver);
    }
}
