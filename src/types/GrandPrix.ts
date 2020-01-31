import {Circuit} from "@/types/Circuit";

export interface GrandPrix {
    id: string;
    name: string;
    code: string;
    season: number;
    round: number;
    circuit: Circuit;
    promo_image_url: string;
    qualiTime: any; //ToDO: Buscar tipos de datos de fechas
    raceTime: any;
    laps: number;
}