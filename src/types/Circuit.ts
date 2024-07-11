import {CircuitVariant, ICircuitVariant} from "@/types/CircuitVariant";
import {BASE_URL} from "@/_services";

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
    temporalLogoImage?: Blob;

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

    public circuitLink(): Object {
        return {
            name: 'circuitDetails',
            params: {circuit: this.id}
        };
    }

    public logoImage(): string {
        if (this.temporalLogoImage) {
            return URL.createObjectURL(this.temporalLogoImage);
        }
        if (this.hasLogoImage) {
            return BASE_URL + `/circuits/${this.id}/logo`;
        }

        return this.layoutImage();
    }

    public layoutImage(variantId?: number): string {
        if (variantId) {
            return this.variants[variantId].layoutImage();
        }
        if (this.variants.length > 0) {
            return this.variants[0].layoutImage();
        }

        // ToDo: coger la imagen por defecto de los assets
        return 'https://github.com/Cadiducho/PrognoSports-Frontend/blob/develop/src/assets/default_profile_image.jpg?raw=true';
    }
}