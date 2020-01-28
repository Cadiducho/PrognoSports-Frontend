import axios from "axios";

export const driversService = {
    getDriversInGrandPrix
};

async function getDriversInGrandPrix(gp) {
    return await axios.get(`/gps/${gp.season}/${gp.id}/drivers`);
}