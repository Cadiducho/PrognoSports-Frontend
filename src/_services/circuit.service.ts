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

    public async listCircuitVariant(circuit: Circuit): Promise<Array<CircuitVariant>> {
        const circuitData = await axios.get(`/circuits/${circuit.id}/variants`) as ICircuitVariant[];
        return circuitData.map(data => new CircuitVariant(data));
    }

    public async createCircuit(data: any): Promise<Circuit> {
        return await axios.post(`/circuits`, data)
    }

    public async createCircuitVariant(circuit: Circuit, data: Partial<CircuitVariant>): Promise<CircuitVariant> {
        return await axios.post(`/circuits/${circuit.id}`, data);
    }

    public async editCircuit(circuit: Circuit, data: Partial<Circuit>): Promise<Circuit> {
        return await axios.put(`/circuits/${circuit.id}`, data)
    }

    public async editCircuitVariant(circuit: Circuit, variant: CircuitVariant, data: Partial<CircuitVariant>): Promise<CircuitVariant> {
        return await axios.put(`/circuits/${circuit.id}/${variant.id}`, data)
    }

    public async changeCircuitLogo(circuit: Circuit, blob: Blob | string) {
        const formData = new FormData();
        formData.append('image', blob);
        return await axios.post(`/circuits/${circuit.id}/logo`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }

    public async changeVariantLayout(circuit: Circuit, variant: CircuitVariant, blob: Blob | string) {
        const formData = new FormData();
        formData.append('image', blob);
        return await axios.post(`/circuits/${circuit.id}/${variant.id}/layout`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }

    public async deleteCircuit(circuit: Circuit): Promise<boolean> {
        return await axios.delete(`/circuits/${circuit.id}`)
    }
}