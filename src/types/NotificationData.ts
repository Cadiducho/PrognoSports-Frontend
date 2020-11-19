import {Community} from "@/types/Community";
import {StartGridPosition} from "@/types/StartGridPosition";
import {UserPoints} from "@/types/UserPoints";

export interface NotificationData {
    gpName: string;
    competition: string;
    gpRound: number;
    gpSeason: string;
    time: Date;
    points: Map<Community, UserPoints>;
    startGrid: Array<StartGridPosition>;
    info: string;
    href: string;
}