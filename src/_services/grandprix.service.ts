import axios from "axios";
import {GrandPrix} from "@/types/GrandPrix";

export const grandPrixService = {
    getNextGrandPrix,
    getGrandPrixesList,
    getGrandPrix,
    getTipps,
};

async function getNextGrandPrix() : Promise<GrandPrix> {
    return await axios.get('/gps/f1/next');
}

async function getGrandPrixesList(searchType: string, season: number): Promise<Array<GrandPrix>> {
    return await axios.get(`/gps/f1/${season}`, {
        params: {
            searchType: searchType
        }
    });
}

async function getGrandPrix(season: number, id: number): Promise<GrandPrix> {
    return await axios.get(`/gps/f1/${season}/${id}`);
}

async function getTipps(gp: GrandPrix, communityId: number) {
    return await axios.get(`/gps/f1/${gp.season}/${gp.id}/qualiTipps/${communityId}`);
}