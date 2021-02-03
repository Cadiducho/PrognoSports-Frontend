import {CircuitVariant} from "@/types/CircuitVariant";

export interface Circuit {
    id: string;
    name: string;
    country: string;
    locality: string;
    latitude: number;
    longitude: number;
    logo_url: string;
    variant: CircuitVariant;
}