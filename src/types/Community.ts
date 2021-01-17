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
    cantidad_usuarios: number;

    qualify_positions_predict: number;
    race_positions_predict: number;
}