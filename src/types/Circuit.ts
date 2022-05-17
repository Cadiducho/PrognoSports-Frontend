import {CircuitVariant} from "@/types/CircuitVariant";

export interface ICircuit {
    id: string;
    name: string;
    country: string;
    locality: string;
    latitude: number;
    longitude: number;
    logo_url: string;
    variant: CircuitVariant;
}

export class Circuit implements ICircuit {
    country: string;
    id: string;
    latitude: number;
    locality: string;
    logo_url: string;
    longitude: number;
    name: string;
    variant: CircuitVariant;

    constructor(data: ICircuit) {
        this.country = data.country;
        this.id = data.id;
        this.latitude = data.latitude;
        this.locality = data.locality;
        this.logo_url = data.logo_url;
        this.longitude = data.longitude;
        this.name = data.name;
        this.variant = new CircuitVariant(data.variant);
    }

    public hasVariant(): boolean {
        return this.variant !== undefined && this.variant.name !== "grandprix";
    }

    public nameWithVariant(): string {
        if (!this.hasVariant()) return this.name;
        return `${this.name} - ${this.variant.name}`;
    }
}