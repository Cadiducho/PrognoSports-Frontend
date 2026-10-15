import {Season} from "@/types/Season";
import {mapRaceSession, RaceSession, RaceSessionDto} from "@/types/RaceSession";

/** Forma de la competición tal y como la devuelve la API */
export interface CompetitionDto {
    id: number;
    code: string;
    name: string;
    fullname: string;
    currentSeason: Season;
    rules: string;
    availableSessions: Array<RaceSessionDto>;
}

export interface Competition {
    id: number;
    code: string;
    name: string;
    fullname: string;
    currentSeason: Season;
    rules: string;
    availableSessions: Array<RaceSession>;
}

export function mapCompetition(dto: CompetitionDto): Competition {
    return {
        id: dto.id,
        code: dto.code,
        name: dto.name,
        fullname: dto.fullname,
        currentSeason: dto.currentSeason,
        rules: dto.rules,
        availableSessions: (dto.availableSessions ?? []).map(mapRaceSession),
    };
}
