import axios from "axios";
import {GrandPrix} from "@/types/GrandPrix";

export const grandPrixService = {
    getNextGrandPrix,
    getGrandPrixesList,
    getGrandPrix,
    getTipps,
};

async function getNextGrandPrix() {
    return await axios.get('/gps/next');
}

async function getGrandPrixesList(searchType: string, season: number): Promise<Array<GrandPrix>> {
    return await axios.get(`/gps/${season}`, {
        params: {
            searchType: searchType
        }
    });
}

async function getGrandPrix(season: number, id: number) {
    return await axios.get(`/gps/${season}/${id}`);
}

async function getTipps(gp: GrandPrix, communityId: number) {
    return await axios.get(`/gps/${gp.season}/${gp.id}/qualiTipps/${communityId}`);
}