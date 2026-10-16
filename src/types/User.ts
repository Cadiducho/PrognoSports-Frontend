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

/** Forma del resumen del usuario tal y como lo devuelve la API */
export interface UserResumeDto {
  totalPoints: number;
  standings: number;
  average: number;

  totalPointsBySession: Record<string, number>;
  averagePointsBySession: Record<string, number>;
  participationsBySession: Record<string, number>;
  wonSessions: Record<string, Array<string>>; // Session ID -> nombres de los Grandes Premios ganados
  wonGrandPrixes: Array<string>;
}

export interface UserResume {
  totalPoints: number;
  standings: number;
  average: number;

  totalPointsBySession: Record<string, number>;
  averagePointsBySession: Record<string, number>;
  participationsBySession: Record<string, number>;
  wonSessions: Map<string, Array<string>>; // Nombre de la sesión -> nombres de los Grandes Premios ganados
  wonGrandPrixes: Array<string>;
}

export function mapUserResume(dto: UserResumeDto): UserResume {
  const wonSessions = new Map<string, Array<string>>();
  Object.entries(dto.wonSessions).forEach(([sessionId, list]) => {
    const sessionName = sessionHumanNameById(sessionId);
    if (sessionName) {
      wonSessions.set(sessionName, list);
    }
  });

  return {
    totalPoints: dto.totalPoints,
    standings: dto.standings,
    average: dto.average,
    totalPointsBySession: dto.totalPointsBySession,
    averagePointsBySession: dto.averagePointsBySession,
    participationsBySession: dto.participationsBySession,
    wonSessions,
    wonGrandPrixes: dto.wonGrandPrixes,
  };
}
