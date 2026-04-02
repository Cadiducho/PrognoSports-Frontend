import mitt, { Emitter } from 'mitt';
import {RaceSession} from "@/types/RaceSession";
import {Driver} from "@/types/Driver";

export type Events = {
    changeGridSession: RaceSession;
    updatedTipps: { session: RaceSession; tipps: Array<Driver> };
    reloadCommunitiesList: void;
    reloadCommunitiesDropdown: void;
    breadcrumbLastname: string;
};

const emitter: Emitter<Events> = mitt<Events>();

export default function useEmitter() {
    return emitter;
}
