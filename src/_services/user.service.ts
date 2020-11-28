import axios from 'axios';
import {User} from "@/types/User";
import {Community} from "@/types/Community";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";

export class UserService {

    public async login(username: string, password: string): Promise<string> {
        return await axios
            .post('/auth/login', {
                "username": username,
                "password": password
            });
    }

    public async getMe(): Promise<User> {
        return await axios
            .get('/user/me');
    }

    public async getUser(user: number): Promise<User> {
        return await axios.get(`/user/${user}`);
    }

    public async getUsersInCommunity(communityId: number): Promise<Array<User>> {
        return await axios.get(`/communities/${communityId}/members`);
    }

    public async register(email: string, username: string, password: string) {
        return await axios
            .post('/auth/register', {
                "email": email,
                "username": username,
                "password": password
            });
    }

    public async sendForgotPassword(email: string) {
        return await axios.post("/auth/forgotpassword", {"email": email});
    }

    public async changePassword(email: string, inputToken: string, inputPassword: string) {
        return await axios.patch("/auth/changepassword", {"email": email, "token": inputToken, "password": inputPassword});
    }

    public async getPointsInCommunity(user: User, community: Community, competition: Competition, season: Season): Promise<any> {
        return await axios.get(`/user/${user.id}/communities/${community.id}/${competition.id}/${season.id}/points`);
    }

    public async getCumulatedPointsInCommunity(user: User, community: Community, competition: Competition, season: Season): Promise<Map<string, number>> {
        return await axios.get(`/user/${user.id}/communities/${community.id}/${competition.id}/${season.id}/cummulatedpoints`);
    }
}