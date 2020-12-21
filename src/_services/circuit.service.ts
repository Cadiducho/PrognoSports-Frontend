import axios from "axios";
import { Circuit } from '@/types/Circuit';

export class CircuitService {
    public async getCircuitList() : Promise<Array<Circuit>> {
        return await axios.get(`/circuits`);
    }

    
}