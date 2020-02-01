import axios from 'axios';
import {Community} from "@/types/Community";

export const communityService = {
    getCurrentCommunity,
    getUserPointsByGP,
    getUserCummulatedPointsByGP,
    getTotalUserPoints
};

async function getCurrentCommunity(communityId: number): Promise<Community> {
    return await axios.get(`/communities/${communityId}`);
}

async function getUserPointsByGP(communityId: number, season: number) {
    return await axios.get(`/communities/${communityId}/${season}/points`);
}

async function getUserCummulatedPointsByGP(communityId: number, season: number) {
    return await axios.get(`/communities/${communityId}/${season}/cummulatedpoints`);
}

async function getTotalUserPoints(communityId: number, season: number) {
    return await axios.get(`/communities/${communityId}/${season}/totaluserpoints`);
}