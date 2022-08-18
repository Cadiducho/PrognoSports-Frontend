import {UserRank} from "@/types/UserRank";
import {Community} from "@/types/Community";

export interface User {
    id: number;
    username: string;
    email: string;
    bio?: string;
    password?: string;
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

export interface UserResume {
    totalPoints: number;
    standings: number;
    average: number;

    totalPointsBySession: Map<string, number>;
    averagePointsBySession: Map<string, number>;
    participationsBySession: Map<string, number>;
    wonSessions: Map<string, Array<string>>;
    wonGrandPrixes: Array<string>;
}