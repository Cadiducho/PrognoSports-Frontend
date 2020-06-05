import axios from "axios";
import {GrandPrix} from "@/types/GrandPrix";
import {Driver} from "@/types/Driver";

export const driversService = {
    getDriversInGrandPrix: getDriversInGrandPrix
};

async function getDriversInGrandPrix(gp: GrandPrix): Promise<Array<Driver>> {
    return await axios.get(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/drivers`);
}
