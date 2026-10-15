import {UserRank} from "@/types/UserRank";
import {Community, CommunityDto, mapCommunity} from "@/types/Community";
import {Dictionary} from "@/types/Dictionary";
import {sessionHumanNameById} from "@/utils/raceSession";

export type UserId = number;

/** Forma del usuario tal y como la devuelve la API (las fechas llegan como texto) */
export interface UserDto {
  id: UserId;
  username: string;
  email: string;
  bio?: string;
  password?: string;
  rank: UserRank;
  created?: string,
  updated?: string,
  last_activity?: string,
  verified_at?: string,
  birthdate?: string,
  gender: string;
  location: string;
  currentCommunity: CommunityDto;
  preferences: Dictionary<string, any>;
  hasProfileImage: boolean;
}

export interface User {
  id: UserId;
  username: string;
  email: string;
  bio: string;
  password: string;
  rank: UserRank;
  created?: Date,
  updated?: Date,
  last_activity?: Date,
  verified_at?: Date,
  birthdate?: Date,
  gender: string;
  location: string;
  currentCommunity: Community;
  preferences: Dictionary<string, any>;
  hasProfileImage: boolean;
}

export function mapUser(dto: UserDto): User {
  return {
    id: dto.id,
    username: dto.username,
    email: dto.email,
    bio: dto.bio ?? '',
    password: dto.password ?? '',
    rank: dto.rank,
    gender: dto.gender,
    location: dto.location,
    currentCommunity: dto.currentCommunity && mapCommunity(dto.currentCommunity),
    preferences: dto.preferences,
    hasProfileImage: dto.hasProfileImage,
    created: dto.created ? new Date(dto.created) : undefined,
    updated: dto.updated ? new Date(dto.updated) : undefined,
    last_activity: dto.last_activity ? new Date(dto.last_activity) : undefined,
    verified_at: dto.verified_at ? new Date(dto.verified_at) : undefined,
    birthdate: dto.birthdate ? new Date(dto.birthdate) : undefined,
  };
}

export interface IUserResume {
  totalPoints: number;
  standings: number;
  average: number;

  totalPointsBySession: Map<string, number>;
  averagePointsBySession: Map<string, number>;
  participationsBySession: Map<string, number>;
  wonSessions: Map<number | string, Array<string>>;
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
    this.wonSessions = new Map();
    Object.entries(data.wonSessions).forEach(([sessionId, list]) => {
      const sessionName = sessionHumanNameById(sessionId);
      if (sessionName) {
        this.wonSessions.set(sessionName, list as Array<string>);
      }
    });
  }
}
