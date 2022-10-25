import {BASE_URL} from "@/_services";

export interface ICircuitVariant {
    circuitId: string;
    name: string;
    distance: number;
    turns: number;
    hasLayoutImage: boolean;
}

export class CircuitVariant implements ICircuitVariant {
    circuitId: string;
    distance: number;
    name: string;
    turns: number;
    hasLayoutImage: boolean;

    constructor(data: ICircuitVariant) {
        this.distance = data.distance;
        this.name = data.name;
        this.turns = data.turns;
        this.hasLayoutImage = data.hasLayoutImage;
        this.circuitId = data.circuitId;
    }

    public layoutImage(): string {
        if (this.hasLayoutImage) {
            return BASE_URL + `/circuits/${this.circuitId}/${this.name}/layout`;
        }

        // ToDo: coger la imagen por defecto de los assets
        return 'https://github.com/Cadiducho/PrognoSports-Frontend/blob/develop/src/assets/default_profile_image.jpg?raw=true';
    }
}