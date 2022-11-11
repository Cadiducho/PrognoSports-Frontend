import axios from "axios";
import {Circuit, ICircuit} from '@/types/Circuit';
import {CircuitVariant, ICircuitVariant} from "@/types/CircuitVariant";
import {PrognoService} from "@/_services/progno.service";

export class CircuitService extends PrognoService<ICircuit, Circuit> {

    factory(data: ICircuit): Circuit {
        return new Circuit(data);
    }

    public async getCircuitList(): Promise<Array<Circuit>> {
        return this.getObjectListFromAPI(`/circuits`);
    }

    public async getCircuit(circuitId: string): Promise<Circuit> {
        return this.getObjectFromAPI(`/circuits/${circuitId}`);
    }

    public async getCircuitWithVariant(circuitId: string, variantId: string) : Promise<Circuit> {
        return this.getObjectFromAPI(`/circuits/${circuitId}/${variantId}`);
    }

    public async listCircuitVariant(circuit: Circuit): Promise<Array<CircuitVariant>> {
        const circuitData = await axios.get(`/circuits/${circuit.id}/variants`) as ICircuitVariant[];
        return circuitData.map(data => new CircuitVariant(data));
    }

    public async createCircuit(data: any): Promise<Circuit> {
        return await axios.post(`/circuits`, data)
    }

}