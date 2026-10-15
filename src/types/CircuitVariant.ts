/** Forma de la variante de circuito tal y como la devuelve la API */
export interface CircuitVariantDto {
    id: number;
    circuitId: string;
    name: string;
    distance: number;
    turns: number;
    hasLayoutImage: boolean;
}

export interface CircuitVariant {
    id: number;
    circuitId: string;
    name: string;
    distance: number;
    turns: number;
    hasLayoutImage: boolean;
}

export function mapCircuitVariant(dto: CircuitVariantDto): CircuitVariant {
    return {
        id: dto.id,
        circuitId: dto.circuitId,
        name: dto.name,
        distance: dto.distance,
        turns: dto.turns,
        hasLayoutImage: dto.hasLayoutImage,
    };
}
