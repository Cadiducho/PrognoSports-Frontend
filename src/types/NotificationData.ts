import {StartGridPosition} from "@/types/StartGridPosition";
import {UserPoints} from "@/types/UserPoints";
import {Dictionary} from "@/types/Dictionary";

export interface NotificationData {
    gpName: string;
    competition: string;
    gpRound: number;
    gpSeason: string;
    time: Date;
    points: Dictionary<string, UserPoints>;
    startGrid: Array<StartGridPosition>;
    info: string;
    href: string;
}