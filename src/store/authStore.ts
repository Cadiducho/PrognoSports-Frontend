import {defineStore} from 'pinia'
import {IUser, User} from "@/types/User";
import {Community} from "@/types/Community";
import {authService, userService} from "@/_services";
import {useCommunityStore} from "@/store/communityStore";

export const useAuthStore = defineStore('auth', {

    state: () => ({
        user: {id: 0} as IUser,
        mail: "",
        token: localStorage.getItem('token') ?? null
    }),
    getters: {
        isLoggedIn(): boolean {
            return this.user.id !== 0;
        },
        loggedUser(): User {
            return new User(this.user);
        },
    },
    actions: {
        loginSuccess(token: string): void {
            this.token = token;
        },
        logout(): void {
            this.user = {id: 0} as User;
            this.token = null;
        },
        userRequestSuccess(user: User): void {
            this.user = user;
            const communityStore = useCommunityStore();
            communityStore.setCommunityFromUserRequest(user);
        },
        changeMailState(mail: string): void {
            this.mail = mail;
        },
        setCurrentUserCommunity(community: Community): void {
            this.user.currentCommunity = community;
        },
        removeUserCurrentCommunity(): void {
            if (this.user.id !== 0) {
                this.user.currentCommunity = {id: 0} as Community;
            }
        },
        login(payload: { username: string, password: string }): Promise<string> {
            let {username, password} = payload;
            return authService.login(username, password).then(
                token => {
                    this.loginSuccess(token);
                    localStorage.setItem('token', token);
                    this.changeMailState(""); // Ya no guardar el mail state tras el login correcto
                    return Promise.resolve(token);
                },
                error => {
                    localStorage.removeItem('token');
                    this.logout();
                    return Promise.reject(error);
                }
            );
        },
        signOut(): Promise<void> {
            return new Promise((resolve => {
                localStorage.removeItem('token');
                const communityStore = useCommunityStore();
                communityStore.removeCurrentCommunity();
                this.logout();
                resolve();
            }))
        },
        register(payload: { username: string, email: string, password: string }): Promise<any> {
            let {username, email, password} = payload;
            return authService.register(email, username, password).then(
                response => {
                    this.changeMailState(email);
                    return Promise.resolve(response);
                },
                error => {
                    this.changeMailState("");
                    return Promise.reject(error);
                }
            );
        },
        userRequest(): Promise<User> {
            if (!this.token) {
                return Promise.reject();
            }
            return userService.getMe().then(
                user => {
                    //console.log("[🍍] user success: " + user.username);
                    this.userRequestSuccess(user);
                    return Promise.resolve(user);
                },
                error => {
                    //console.log("[🍍] user error. Sign out");
                    this.signOut();
                    return Promise.reject(error);
                }
            );
        },
    },
});
