import axios from 'axios';
import {Community} from "@/types/Community";
import {User} from "@/types/User";

export const communityService = {
    getCurrentCommunity,
    getUserPointsByGP,
    getUserCummulatedPointsByGP,
    getTotalUserPoints,
    getUserCommunities
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

async function getUserCommunities(user: User): Promise<Array<Community>> {
    return await axios.get(`/user/${user.id}/communities`);
}