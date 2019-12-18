import axios from 'axios';

export const communityService = {
    getCurrentCommunity,
    getUserPointsByGP,
    getUserCummulatedPointsByGP,
    getTotalUserPoints
};

async function getCurrentCommunity(communityId) {
    return await axios.get(`/communities/${communityId}`);
}

async function getUserPointsByGP(communityId, season) {
    return await axios.get(`/communities/${communityId}/${season}/points`);
}

async function getUserCummulatedPointsByGP(communityId, season) {
    return await axios.get(`/communities/${communityId}/${season}/cummulatedpoints`);
}

async function getTotalUserPoints(communityId, season) {
    return await axios.get(`/communities/${communityId}/${season}/totaluserpoints`);
}