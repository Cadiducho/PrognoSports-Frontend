import {CircuitVariant, ICircuitVariant} from "@/types/CircuitVariant";
import {BASE_URL} from "@/_services";
import {RaceSession} from "@/types/RaceSession";

export interface ICircuit {
    id: string;
    name: string;
    country: string;
    locality: string;
    latitude: number;
    longitude: number;
    hasLogoImage: boolean;
    variants: Array<ICircuitVariant>;
}

export class Circuit implements ICircuit {
    id: string;
    name: string;
    country: string;
    locality: string;
    latitude: number;
    longitude: number;
    hasLogoImage: boolean;
    variants: Array<CircuitVariant>;

    constructor(data: ICircuit) {
        this.country = data.country;
        this.id = data.id;
        this.latitude = data.latitude;
        this.locality = data.locality;
        this.longitude = data.longitude;
        this.name = data.name;
        this.hasLogoImage = data.hasLogoImage;
        this.variants = [];
        data.variants?.forEach(variant => {
            this.variants.push(new CircuitVariant(variant));
        })
    }

    public hasVariant(): boolean {
        return this.variant !== undefined && this.variant.name !== "grandprix";
    }

    public nameWithVariant(): string {
        if (!this.hasVariant()) return this.name;
        return `${this.name} - ${this.variant.name}`;
    }

    public logoImage(): string {
        if (this.hasLogoImage) {
            return BASE_URL + `/circuits/${this.id}/logo`;
        } /*else if (this.variant.hasLayoutImage) {
            return this.variant.layoutImage();
        }*/

        // ToDo: coger la imagen por defecto de los assets
        return 'https://github.com/Cadiducho/PrognoSports-Frontend/blob/develop/src/assets/default_profile_image.jpg?raw=true';
    }
}