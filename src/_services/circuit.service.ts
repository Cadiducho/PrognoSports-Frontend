export class CircuitService {
    public async getNextGrandPrix(competition: Competition) : Promise<GrandPrix> {
        return await axios.get(`/gps/${competition.code}/next`);
    }

    
}