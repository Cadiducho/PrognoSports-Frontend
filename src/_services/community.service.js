import axios from 'axios';

export const communityService = {
    getCurrentCommunity
};

function getCurrentCommunity(communityId) {
    return axios.get(`/communities/${communityId}`);
}