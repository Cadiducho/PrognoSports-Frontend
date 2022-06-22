import mitt, { Emitter } from 'mitt';
import {RaceSession} from "@/types/RaceSession";

export type Events = {
    changeGridSession: RaceSession;
    reloadCommunitiesList: void;
    reloadCommunitiesDropdown: void;
    breadcrumbLastname: string;
};

const emitter: Emitter<Events> = mitt<Events>();

export default function useEmitter() {
    return emitter;
}