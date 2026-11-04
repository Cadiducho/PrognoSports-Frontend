import {CircuitVariant, CircuitVariantDto, mapCircuitVariant} from "@/types/CircuitVariant";

/** Forma del circuito tal y como lo devuelve la API */
export interface CircuitDto {
    id: number;
    name: string;
    country: string;
    locality: string;
    latitude: number;
    longitude: number;
    hasLogoImage: boolean;
    variants: Array<CircuitVariantDto>;
}

export interface Circuit {
    id: number;
    name: string;
    country: string;
    locality: string;
    latitude: number;
    longitude: number;
    hasLogoImage: boolean;
    variants: Array<CircuitVariant>;
}

export function mapCircuit(dto: CircuitDto): Circuit {
    return {
        id: dto.id,
        name: dto.name,
        country: dto.country,
        locality: dto.locality,
        latitude: dto.latitude,
        longitude: dto.longitude,
        hasLogoImage: dto.hasLogoImage,
        variants: (dto.variants ?? []).map(mapCircuitVariant),
    };
}
