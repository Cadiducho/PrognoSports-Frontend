import {Competition, CompetitionDto, mapCompetition} from "@/types/Competition";

/** Forma de la temporada tal y como la devuelve la API */
export interface SeasonDto {
    id: number;
    competition: CompetitionDto;
    name: string;
    totalEvents: number;
}

export interface Season {
    id: number;
    competition: Competition;
    name: string;
    totalEvents: number;
}

export function mapSeason(dto: SeasonDto): Season {
    return {
        id: dto.id,
        competition: dto.competition && mapCompetition(dto.competition),
        name: dto.name,
        totalEvents: dto.totalEvents,
    };
}
