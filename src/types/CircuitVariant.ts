import {BASE_URL} from "@/_services";

export interface ICircuitVariant {
    id: number;
    circuitId: string;
    name: string;
    distance: number;
    turns: number;
    hasLayoutImage: boolean;
}

export class CircuitVariant implements ICircuitVariant {
    id: number;
    circuitId: string;
    distance: number;
    name: string;
    turns: number;
    hasLayoutImage: boolean;
    temporalLayoutImage?: Blob;
    isNew?: boolean;

    constructor(data: ICircuitVariant) {
        this.id = data.id;
        this.distance = data.distance;
        this.name = data.name;
        this.turns = data.turns;
        this.hasLayoutImage = data.hasLayoutImage;
        this.circuitId = data.circuitId;
    }

    public isDefault(): boolean {
        return this.name == 'GrandPrix';
    }

    public layoutImage(force: boolean = false): string {
        if (this.temporalLayoutImage) {
            return URL.createObjectURL(this.temporalLayoutImage);
        }
        if (force || this.hasLayoutImage) {
            return BASE_URL + `/circuits/${this.circuitId}/${this.id}/layout`;
        }

        // ToDo: coger la imagen por defecto de los assets
        return 'https://github.com/Cadiducho/PrognoSports-Frontend/blob/develop/src/assets/default_profile_image.jpg?raw=true';
    }
}