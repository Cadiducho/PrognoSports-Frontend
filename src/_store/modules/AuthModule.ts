import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import {authService, communityService, userService} from "@/_services";
import {User} from "@/types/User";
import {Community} from "@/types/Community";

const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('token');
const storedCommunity = localStorage.getItem('community');

//ToDo: Mail state en el registro

@Module({ namespaced: true })
class AuthVuexModule extends VuexModule {
    public status = storedUser ? { loggedIn: true } : { loggedIn: false };
    public user = storedUser ? JSON.parse(storedUser) : null;
    public token = storedToken ? JSON.parse(storedToken) : null;
    public community = storedCommunity ? JSON.parse(storedCommunity) : null;

    @Mutation
    public loginSuccess(token: string): void {
        this.status.loggedIn = true;
        this.token = token;
    }

    @Mutation
    public userRequestSuccess(user: User): void {
        this.status.loggedIn = true;
        this.user = user;
    }

    @Mutation
    public loginFailure(): void {
        this.status.loggedIn = false;
        this.user = null;
        this.token = null;
    }

    @Mutation
    public logout(): void {
        this.status.loggedIn = false;
        this.user = null;
        this.token = null;
    }

    @Mutation
    public registerSuccess(): void {
        this.status.loggedIn = false;
    }

    @Mutation
    public registerFailure(): void {
        this.status.loggedIn = false;
    }

    @Mutation
    public setCurrentCommunity(community: Community): void {
        this.community = community;
    }

    @Mutation
    public removeCurrentCommunity(): void {
        this.community = null;
    }

    // Actions de Auth
    @Action({ rawError: true })
    login(payload: {username: string, password: string}): Promise<string> {
        let {username, password} = payload;
        return authService.login(username, password).then(
            token => {
                localStorage.setItem('user-token', token);
                this.context.commit('loginSuccess', token);
                //ToDo: Mail state
                this.context.dispatch('userRequest');
                return Promise.resolve(token);
            },
            error => {
                this.context.commit('loginFailure');
                return Promise.reject(error);
            }
        );
    }

    @Action
    signOut(): void {
        localStorage.removeItem('user');
        localStorage.removeItem('user-token');
        this.context.commit('removeCurrentCommunity');
        this.context.commit('logout');
    }

    @Action({ rawError: true })
    register(payload: {username: string, email: string, password: string}): Promise<any> {
        let {username, email, password} = payload;
        return authService.register(username, email, password).then(
            response => {
                this.context.commit('registerSuccess');
                return Promise.resolve(response);
            },
            error => {
                this.context.commit('registerFailure');
                return Promise.reject(error);
            }
        );
    }

    // Actions de User
    @Action({ rawError: true })
    userRequest(): Promise<User> {
        return userService.getMe().then(
            user => {
                localStorage.setItem('user', JSON.stringify(user));
                this.context.commit('userRequestSuccess', user);
                if (user.currentCommunity) {
                    this.context.dispatch('communityRequest', {communityId: user.currentCommunity.id});
                }
                return Promise.resolve(user);
            },
            error => {
                console.log("Auth error..." + error);
                this.context.commit('loginFailure');
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
                this.context.commit('setCurrentCommunity', community);
                return Promise.resolve(community);
            },
            error => {
                console.log("Community error...");
                console.log(error);
                this.context.commit('removeCurrentCommunity');
                return Promise.reject(error);
            }
        );
    }

    @Action
    setCommunity(community: Community): void {
        localStorage.setItem('community', JSON.stringify(community));
        this.context.commit('setCurrentCommunity', community);
    }

    @Action
    removeCommunity(): void {
        localStorage.removeItem('community');
        this.context.commit('removeCurrentCommunity');
    }
    // ----

    get isLoggedIn(): boolean {
        return this.status.loggedIn;
    }

    get isProfileLoaded(): boolean {
        if (this.user === null) return false;
        if (this.user.id === undefined) return false;
        return !!this.user.username;
    }

    get thereIsCurrentCommunity() {
        if (this.community === null) return false;
        if (this.community.id === undefined) return false;
        return this.community.id > 0;
    }
}

export default AuthVuexModule;