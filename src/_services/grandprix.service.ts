import axios from "axios";
import {GrandPrix} from "@/types/GrandPrix";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";

export const grandPrixService = {
    getNextGrandPrix,
    getGrandPrixesList,
    getGrandPrix,
    getTipps,
};

async function getNextGrandPrix(competition: Competition) : Promise<GrandPrix> {
    return await axios.get(`/gps/${competition.code}/next`);
}

async function getGrandPrixesList(searchType: string, competition: Competition, season: Season): Promise<Array<GrandPrix>> {
    switch (searchType) {
        case "next":
            return await axios.get(`/gps/${competition.code}/${season.name}/next`);
        case "past":
            return await axios.get(`/gps/${competition.code}/${season.name}/past`);
        default:
            return await axios.get(`/gps/${competition.code}/${season.name}`);
    }
}

async function getGrandPrix(competition: Competition, season: Season, id: string): Promise<GrandPrix> {
    return await axios.get(`/gps/${competition.code}/${season}/${id}`);
}

async function getTipps(gp: GrandPrix, communityId: number) {
    return await axios.get(`/gps/${gp.competition.id}/${gp.season.id}/${gp.id}/qualiTipps/${communityId}`);
}