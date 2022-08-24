import axios from 'axios';
import {User, UserResume} from "@/types/User";
import {Community} from "@/types/Community";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";

export class UserService {

    public async getMe(): Promise<User> {
        return await axios.get('/user/me');
    }

    public async getUser(user: string): Promise<User> {
        return await axios.get(`/user/${user}`);
    }

    public async getUsersInCommunity(communityId: number): Promise<Array<User>> {
        return await axios.get(`/communities/${communityId}/members`);
    }

    public async getAllUsers(): Promise<Array<User>> {
        return await axios.get(`/user`);
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

    public async getUserResume(user: User, community: Community, competition: Competition, season: Season): Promise<UserResume> {
        return await axios.get(`/user/${user.id}/communities/${community.id}/${competition.id}/${season.id}/resume`);
    }

    public async updateUser(user: Partial<User>): Promise<string> {
        return await axios.patch(`/user/${user.id}`, user);
    }

    public async linkTelegram(user: User, payload: {'telegram-id': number, 'telegram-firstname': string | null, 'telegram-username': string | null}) {
        return await axios.post(`/user/${user.id}/settings/telegram`, payload);
    }

    public async unlinkTelegram(user: User) {
        return await axios.delete(`/user/${user.id}/settings/telegram`);
    }
}