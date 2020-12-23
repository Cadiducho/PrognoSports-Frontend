import {CircuitVariant} from "@/types/CircuitVariant";

export class Circuit {
    id: string;
    name: string;
    country: string;
    locality: string;
    latitude: number;
    longitude: number;
    logo_url: string;
    variant: CircuitVariant;

    constructor(id: string, name: string, country: string, locality: string, latitude: number, longitude: number, logo_url: string, variant: CircuitVariant) {
        this.id = id;
        this.name = name;
        this.country = country;
        this.locality = locality;
        this.latitude = latitude;
        this.longitude = longitude;
        this.logo_url = logo_url;
        this.variant = variant;
    }

    get hasVariant(): boolean {
        return this.variant.name !== "grandprix";
    }
}