import axios from "axios";
import { Circuit } from '@/types/Circuit';
import { GrandPrix } from "@/types/GrandPrix";
import { CircuitVariant } from "@/types/CircuitVariant";
import {RuleSet} from "@/types/RuleSet";

export class CircuitService {

    public async getCircuitList() : Promise<Array<Circuit>> {
        return await axios.get(`/circuits`);
    }

    public async getCircuit(circuitId: string) : Promise<Circuit> {
        return await axios.get(`/circuits/${circuitId}`);
    }

    public async getCircuitWithVariant(circuitId: string, variantId: string) : Promise<Circuit> {
        return await axios.get(`/circuits/${circuitId}/${variantId}`);
    }

    public async listCircuitVariant(circuit: Circuit): Promise<Array<CircuitVariant>> {
        return await axios.get(`/circuits/${circuit.id}/variants`);
    }

    public async createCircuit(data: any): Promise<Circuit> {
        return await axios.post(`/circuits`, data)
    }

}