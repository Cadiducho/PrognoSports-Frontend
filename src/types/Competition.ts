import {Season} from "@/types/Season";
import {RaceSession} from "@/types/RaceSession";

export interface Competition {
    id: number;
    code: string;
    name: string;
    fullname: string;
    currentSeason: Season;
    rules: string;

    availableSessions: RaceSession[];
}