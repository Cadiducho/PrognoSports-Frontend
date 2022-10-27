import {UserRank} from "@/types/UserRank";
import {Community} from "@/types/Community";
import {Dictionary} from "@/types/Dictionary";
import {BASE_URL} from "@/_services";

export interface IUser {
    id: number;
    username: string;
    email: string;
    bio?: string;
    password?: string;
    rank: UserRank;
    created: Date,
    updated: Date,
    last_activity: Date,
    birthdate: Date,
    gender: string;
    location: string;
    currentCommunity: Community;
    preferences: Dictionary<string, any>;
    hasProfileImage: boolean;
}

export class User implements IUser {
    bio: string;
    birthdate: Date;
    created: Date;
    currentCommunity: Community;
    email: string;
    gender: string;
    id: number;
    last_activity: Date;
    location: string;
    password: string;
    preferences: Dictionary<string, any>;
    rank: UserRank;
    updated: Date;
    username: string;
    hasProfileImage: boolean;
    changedProfileImage?: Blob;

    constructor(data: IUser) {
        this.bio = data.bio ?? '';
        this.birthdate = data.birthdate;
        this.created = data.created;
        this.currentCommunity = data.currentCommunity;
        this.email = data.email;
        this.gender = data.gender;
        this.id = data.id;
        this.last_activity = data.last_activity;
        this.location = data.location;
        this.password = data.password ?? '';
        this.preferences = data.preferences;
        this.rank = data.rank;
        this.updated = data.updated;
        this.username = data.username;
        this.hasProfileImage = data.hasProfileImage;
    }

    public profileImage(): string {
        if (this.changedProfileImage) {
            return URL.createObjectURL(this.changedProfileImage);
        }

        if (this.hasProfileImage) {
            return BASE_URL + `/user/${this.id}/image`;
        }

        // ToDo: coger la imagen por defecto de los assets
        return 'https://github.com/Cadiducho/PrognoSports-Frontend/blob/develop/src/assets/default_profile_image.jpg?raw=true';
    }

    public styleRankTag() {
        return {
            backgroundColor: '#' + this.rank.color,
            color: 'white',
        }
    }
}

export interface IUserResume {
    totalPoints: number;
    standings: number;
    average: number;

    totalPointsBySession: Map<string, number>;
    averagePointsBySession: Map<string, number>;
    participationsBySession: Map<string, number>;
    wonSessions: Map<string, Array<string>>;
    wonGrandPrixes: Array<string>;
}

export class UserResume implements IUserResume {
    average: number;
    averagePointsBySession: Map<string, number>;
    participationsBySession: Map<string, number>;
    standings: number;
    totalPoints: number;
    totalPointsBySession: Map<string, number>;
    wonGrandPrixes: Array<string>;
    wonSessions: Map<string, Array<string>>;

    constructor(data: IUserResume) {
        this.average = data.average;
        this.averagePointsBySession = data.averagePointsBySession;
        this.participationsBySession = data.participationsBySession;
        this.standings = data.standings;
        this.totalPoints = data.totalPoints;
        this.totalPointsBySession = data.totalPointsBySession;
        this.wonGrandPrixes = data.wonGrandPrixes;
        this.wonSessions = data.wonSessions;
    }
}