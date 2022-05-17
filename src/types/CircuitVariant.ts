export interface ICircuitVariant {
    name: string;
    distance: number;
    turns: number;
    layout_image: string;
}

export class CircuitVariant implements ICircuitVariant {
    distance: number;
    layout_image: string;
    name: string;
    turns: number;

    constructor(data: ICircuitVariant) {
        this.distance = data.distance;
        this.layout_image = data.layout_image;
        this.name = data.name;
        this.turns = data.turns;
    }
}