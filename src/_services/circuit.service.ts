import axios from "axios";
import { Circuit } from '@/types/Circuit';
import { GrandPrix } from "@/types/GrandPrix";

export class CircuitService {

    public async getCircuitList() : Promise<Array<Circuit>> {
        return await axios.get(`/circuits`);
    }

    public async getCircuit(circuitId: string) : Promise<Circuit> {
        return await axios.get(`/circuits/${circuitId}`);
    }

    public async getGPThatUsesCircuit(circuit: Circuit): Promise<Array<GrandPrix>> {
        return await axios.get(`/circuits/${circuit.id}/grandprix/gps`); //ToDo: Buscar por variante
    }
    
}