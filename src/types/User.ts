import {UserRank} from "@/types/UserRank";
import {Community} from "@/types/Community";

export interface User {
    id: number;
    username: string;
    email: string;
    bio: string;
    rank: UserRank;
    profileImageUrl: string;
    created: Date,
    updated: Date,
    last_activity: Date,
    birthdate: Date,
    gender: string;
    location: string;
    currentCommunity: Community;
    preferences: Map<string, any>;
}