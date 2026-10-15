import {Competition, CompetitionDto, mapCompetition} from "@/types/Competition";
import {GrandPrix, IGrandPrix} from "@/types/GrandPrix";

export type SessionId = number;

/** Forma de la sesión tal y como la devuelve la API (la fecha llega como texto) */
export interface RaceSessionDto {
    id: SessionId;
    name: string;
    code: string;
    hasGrid: boolean;
    hasFastLap: boolean;
    competition?: CompetitionDto;
    grandPrix?: IGrandPrix;
    date: string;
    uses: number;
    defineGridOf?: Array<RaceSessionDto>;
}

export interface RaceSession {
    id: SessionId;
    name: string;
    code: string;
    hasGrid: boolean;
    hasFastLap: boolean;
    competition?: Competition;
    grandPrix?: GrandPrix;
    date: Date;
    uses: number;
    defineGridOf: Array<RaceSession>;
}

export function mapRaceSession(dto: RaceSessionDto): RaceSession {
    return {
        id: dto.id,
        name: dto.name,
        code: dto.code,
        hasGrid: dto.hasGrid,
        hasFastLap: dto.hasFastLap,
        competition: dto.competition ? mapCompetition(dto.competition) : undefined,
        grandPrix: dto.grandPrix ? new GrandPrix(dto.grandPrix) : undefined,
        date: new Date(dto.date),
        uses: dto.uses,
        defineGridOf: (dto.defineGridOf ?? []).map(mapRaceSession),
    };
}
