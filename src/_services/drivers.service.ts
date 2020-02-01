import axios from "axios";
import {GrandPrix} from "@/types/GrandPrix";

export const driversService = {
    getDriversInGrandPrix
};

async function getDriversInGrandPrix(gp: GrandPrix) {
    return await axios.get(`/gps/${gp.season}/${gp.id}/drivers`);
}