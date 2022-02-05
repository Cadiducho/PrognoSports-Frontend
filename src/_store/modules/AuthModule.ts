import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import {authService, communityService, userService} from "@/_services";
import {User} from "@/types/User";
import {Community} from "@/types/Community";
import {isValidCommunity, isValidUser} from "@/utils";

const storedToken = localStorage.getItem('token');
const storedCommunityId = localStorage.getItem('community');

@Module({ namespaced: true })
class AuthVuexModule extends VuexModule {

    public user: User = {id: 0} as User;
    public mail: string | null = null;
    public token: string | null = storedToken ?? null;
    public community: Community = new Community({id: 0} as Community);
    public communityId = storedCommunityId ?? 0;

    @Mutation
    public loginSuccess(token: string): void {
        this.token = token;
    }

    @Mutation
    public logout(): void {
        this.user = {id: 0} as User;
        this.token = null;
    }

    @Mutation
    public userRequestSuccess(user: User): void {
        this.user = user;
        if (this.communityId === 0) {
            this.communityId = this.user.currentCommunity.id;
        }
    }

    @Mutation
    public changeMailState(mail: string): void {
        this.mail = mail;
    }

    @Mutation
    public setCurrentCommunity(community: Community): void {
        this.user.currentCommunity = community;
        this.community = community;
        this.communityId = community.id;
    }

    @Mutation
    public removeCurrentCommunity(): void {
        if (this.user.id !== 0) {
            this.user.currentCommunity = {id: 0} as Community;
        }
        this.community = {id: 0} as Community;
        this.communityId = this.community.id;
    }

    // Actions de Auth
    @Action({ rawError: true })
    login(payload: {username: string, password: string}): Promise<string> {
        let {username, password} = payload;
        return authService.login(username, password).then(
            token => {
                this.context.commit('loginSuccess', token);
                localStorage.setItem('token', token);
                this.context.commit('changeMailState', null); // Ya no guardar el mail state tras el login correcto
                return Promise.resolve(token);
            },
            error => {
                localStorage.removeItem('token');
                this.context.commit('logout');
                return Promise.reject(error);
            }
        );
    }

    @Action
    signOut(): Promise<void> {
        return new Promise((resolve => {
            localStorage.removeItem('token');
            localStorage.removeItem('community');
            this.context.commit('removeCurrentCommunity');
            this.context.commit('logout');
            resolve();
        }))
    }

    @Action({ rawError: true })
    register(payload: {username: string, email: string, password: string}): Promise<any> {
        let {username, email, password} = payload;
        return authService.register(username, email, password).then(
            response => {
                this.context.commit('changeMailState', email);
                return Promise.resolve(response);
            },
            error => {
                this.context.commit('changeMailState', null);
                return Promise.reject(error);
            }
        );
    }

    // Actions de User
    @Action({ rawError: true })
    userRequest(): Promise<User> {
        return userService.getMe().then(
            user => {
                this.context.commit('userRequestSuccess', user);
                return Promise.resolve(user);
            },
            error => {
                this.context.dispatch('signOut');
                return Promise.reject(error);
            }
        );
    }
    // Actions de Community
    @Action({ rawError: true })
    communityRequest(payload: {communityId: number}): Promise<Community> {
        let {communityId} = payload;
        return communityService.getCommunityById(communityId).then(
            community => {
                this.context.dispatch('setCommunity', community);
                return Promise.resolve(community);
            },
            error => {
                this.context.commit('removeCurrentCommunity');
                return Promise.reject(error);
            }
        );
    }

    @Action
    setCommunity(community: Community): void {
        localStorage.setItem('community', String(community.id ?? 0));
        this.context.commit('setCurrentCommunity', community);
    }

    @Action
    removeCommunity(): void {
        localStorage.removeItem('community');
        this.context.commit('removeCurrentCommunity');
    }

    // ----

    get isLoggedIn(): boolean {
        return isValidUser(this.user);
    }

    get loggedUser(): User {
        return this.user;
    }

    get thereIsCurrentCommunity() {
        return isValidCommunity(this.community);
    }

    get storedCommunityId() {
        return this.communityId;
    }
}

export default AuthVuexModule;