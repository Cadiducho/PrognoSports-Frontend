import axios from 'axios';
import {IUser, IUserResume, User, UserResume} from "@/types/User";
import {Community} from "@/types/Community";
import {Competition} from "@/types/Competition";
import {Season} from "@/types/Season";
import {PrognoService} from "@/_services/progno.service";

export class UserService extends PrognoService<IUser, User> {

    factory(data: IUser): User {
        return new User(data);
    }

    public async getMe(): Promise<User> {
        return this.getObjectFromAPI('/user/me');
    }

    public async getUser(user: string): Promise<User> {
        return this.getObjectFromAPI(`/user/${user}`);
    }

    public async getUsersInCommunity(communityId: number): Promise<Array<User>> {
        return this.getObjectListFromAPI(`/communities/${communityId}/members`);
    }

    public async getAllUsers(): Promise<Array<User>> {
        return this.getObjectListFromAPI(`/user`);
    }

    public async sendForgotPassword(email: string) {
        return await axios.post("/auth/forgotpassword", {"email": email});
    }

    public async changePassword(email: string, inputToken: string, inputPassword: string) {
        return await axios.patch("/auth/changepassword", {"email": email, "token": inputToken, "password": inputPassword});
    }

    public async getPointsInCommunity(user: User, community: Community, competition: Competition, season: Season): Promise<Map<string, number>> {
        return await axios.get(`/user/${user.id}/communities/${community.id}/${competition.id}/${season.id}/points`);
    }

    public async getCumulatedPointsInCommunity(user: User, community: Community, competition: Competition, season: Season): Promise<Map<string, number>> {
        return await axios.get(`/user/${user.id}/communities/${community.id}/${competition.id}/${season.id}/cummulatedpoints`);
    }

    public async getUserResume(user: User, community: Community, competition: Competition, season: Season): Promise<UserResume> {
        const resumeData = await axios.get(`/user/${user.id}/communities/${community.id}/${competition.id}/${season.id}/resume`) as IUserResume;
        return new UserResume(resumeData);
    }

    public async updateUser(user: Partial<User>): Promise<string> {
        return await axios.patch(`/user/${user.id}`, user);
    }

    public async changePasswordInSettings(user: User, payload: { password: string; newPassword: string }) {
        return await axios.patch(`/user/${user.id}/settings/password`, payload);
    }

    public async changeEmail(user: User, payload: { password: string; email: string }) {
        return await axios.patch(`/user/${user.id}/settings/email`, payload);
    }

    public async linkTelegram(user: User, payload: { id: number; first_name: string | null; username: string | null }) {
        return await axios.post(`/user/${user.id}/settings/telegram`, payload);
    }

    public async unlinkTelegram(user: User) {
        return await axios.delete(`/user/${user.id}/settings/telegram`);
    }

    public async changeProfileImage(user: User, blob: Blob | string) {
        const formData = new FormData();
        formData.append('image', blob);
        return await axios.post(`/user/${user.id}/image`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }
}