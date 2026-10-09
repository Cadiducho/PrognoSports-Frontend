import mitt, { Emitter } from 'mitt';
import { onScopeDispose } from 'vue';
import {RaceSession} from "@/types/RaceSession";
import {Driver} from "@/types/Driver";

export type Events = {
    changeGridSession: RaceSession;
    updatedTipps: { session: RaceSession; tipps: Array<Driver> };
    reloadCommunitiesList: void;
    reloadCommunitiesDropdown: void;
};

const emitter: Emitter<Events> = mitt<Events>();

export default function useEmitter() {
    return emitter;
}

/**
 * Suscribe un handler a un evento y lo desuscribe automáticamente al destruirse
 * el componente (o scope) actual. Debe llamarse dentro de setup().
 */
export function useEmitterListener<K extends keyof Events>(
    event: K,
    handler: (payload: Events[K]) => void
) {
    emitter.on(event, handler);
    onScopeDispose(() => emitter.off(event, handler));
}
