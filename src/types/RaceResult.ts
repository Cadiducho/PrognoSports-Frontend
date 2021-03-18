import {Driver} from "@/types/Driver";
import {RaceSession} from "@/types/RaceSession";

export interface RaceResult {
    driver: Driver;
    position: number;
    raceSession: RaceSession;
}