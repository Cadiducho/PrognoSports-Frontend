import {Circuit, CircuitDto, mapCircuit} from "@/types/Circuit";
import {Season} from "@/types/Season";
import {Competition, CompetitionDto, mapCompetition} from "@/types/Competition";
import {mapRaceSession, RaceSession, RaceSessionDto} from "@/types/RaceSession";
import {CircuitVariant, CircuitVariantDto, mapCircuitVariant} from "@/types/CircuitVariant";

/** Referencia al Gran Premio anterior o siguiente: la API solo garantiza su id */
export interface GrandPrixRef {
    id: number;
}

/** Forma del Gran Premio tal y como lo devuelve la API */
export interface GrandPrixDto {
    id: number;
    name: string;
    code: string;
    competition: CompetitionDto;
    season: Season;
    round: number;
    nextGrandPrix?: GrandPrixRef;
    previousGrandPrix?: GrandPrixRef;
    circuit?: CircuitDto;
    variant?: CircuitVariantDto;
    sessions: Array<RaceSessionDto>
    laps: number;
    suspended: boolean;
    hasPromoImage: boolean;
}

export interface GrandPrix {
    id: number;
    name: string;
    code: string;
    competition: Competition;
    season: Season;
    round: number;
    nextGrandPrix?: GrandPrixRef;
    previousGrandPrix?: GrandPrixRef;
    circuit?: Circuit;
    variant?: CircuitVariant;
    sessions: Array<RaceSession>;
    laps: number;
    suspended: boolean;
    hasPromoImage: boolean;
}

export function mapGrandPrix(dto: GrandPrixDto): GrandPrix {
    const hasCircuit = dto.circuit && dto.variant;
    return {
        id: dto.id,
        code: dto.code,
        name: dto.name,
        competition: dto.competition && mapCompetition(dto.competition),
        laps: dto.laps,
        circuit: hasCircuit ? mapCircuit(dto.circuit!) : undefined,
        variant: hasCircuit ? mapCircuitVariant(dto.variant!) : undefined,
        round: dto.round,
        previousGrandPrix: dto.previousGrandPrix,
        nextGrandPrix: dto.nextGrandPrix,
        season: dto.season,
        suspended: dto.suspended,
        hasPromoImage: dto.hasPromoImage,
        sessions: (dto.sessions ?? []).map(mapRaceSession),
    };
}
