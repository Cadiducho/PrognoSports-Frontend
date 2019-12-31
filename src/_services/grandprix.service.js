import axios from "axios";

export const grandPrixService = {
    getNextGrandPrix,
    getGrandPrixesList
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