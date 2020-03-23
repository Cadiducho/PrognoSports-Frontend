import {UserRank} from "@/types/UserRank";

export interface User {
    id: number;
    username: string;
    email: string;
    bio: string;
    rank: UserRank;
    profileImageUrl: string;
    gender: string;
    location: string;
    currentCommunity: number;
    preferences: Map<string, any>;
}