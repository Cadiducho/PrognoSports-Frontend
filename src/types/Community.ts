import {User} from "@/types/User";

export interface Community {
    id: number;
    name: string;
    description: string;
    image_url: string;
    open: boolean;
    owner: User;
    cantidad_usuarios: number;

    qualify_positions_predict: number;
    race_positions_predict: number;
}