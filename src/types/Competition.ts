import {Season} from "@/types/Season";

export interface Competition {
    id: number;
    code: string;
    name: string;
    fullname: string;
    currentSeason: Season;
}