import {User} from "@/types/User";
import {Competition} from "@/types/Competition";

export interface Community {
    id: number;
    name: string;
    description: string;
    competition: Competition;
    image_url: string;
    open: boolean;
    owner: User;
    created: Date,
    members_amount: number;
    invitation: string;

    qualify_positions_predicted: number;
    race_positions_predicted: number;
}