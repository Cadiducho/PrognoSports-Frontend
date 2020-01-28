import axios from "axios";

export const grandPrixService = {
    getNextGrandPrix,
    getGrandPrixesList,
    getGrandPrix,
    getTipps,
};

async function getNextGrandPrix() {
    return await axios.get('/gps/next');
}

async function getGrandPrixesList(searchType, season) {
    return await axios.get(`/gps/${season}`, {
            params: {
                searchType: searchType
            }
    });
}

async function getGrandPrix(season, id) {
    return await axios.get(`/gps/${season}/${id}`);
}

async function getTipps(gp, community) {
    return await axios.get(`/gps/${gp.season}/${gp.id}/qualiTipps/${community}`);
}