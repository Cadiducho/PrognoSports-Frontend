import { userService } from '@/_services';
import store from '@/_store'
import {Action, getModule, Module, Mutation, VuexModule} from 'vuex-module-decorators'
import {CommunityModule} from "@/_store/modules/CommunityModule";
import {UserModule} from "@/_store/modules/UserModule";

export interface IAuthState {
    token: string
    status: string
    hasLoadedOnce: boolean
}

@Module({dynamic: true, store: store, namespaced: false, name: 'auth' })
class Auth extends VuexModule implements IAuthState {
    token: string = localStorage.getItem('user-token') || '';
    status: string = '';
    hasLoadedOnce: boolean = false;

    get isAuthenticated() {
        return !!this.token;
    }

    get authToken() {
        return this.token;
    }

    get authStatus() {
        return this.status;
    }

    @Action
    async authRequest(payload: {username: string, password: string}): Promise<string> {
        let {username, password} = payload;
        return new Promise((resolve, reject) => {
            this.authRequestLoading();
            userService.login(username, password)
                .then(
                    token => {
                        localStorage.setItem('user-token', token);
                        this.authSuccess(token);
                        UserModule.removeRegisteredMailState();
                        UserModule.userRequest();
                        resolve(token);
                    },
                    error => {
                        console.log("Error: " + error);
                        this.authError();
                        console.log("Error de tipo")
                        reject(error);
                    }
                );
        });
    }

    @Action
    async logout(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.authLogoutMutation();
            CommunityModule.removeCurrentUserCommunity();
            AuthModule.authLogoutMutation();
            CommunityModule.removeCurrentUserCommunity();
            localStorage.removeItem('user-token');
            resolve();
        })
    }

    @Mutation
    authRequestLoading() {
        this.status = 'loading';
    }

    @Mutation
    authSuccess(token: string) {
        this.status = 'success';
        this.token = token;
        this.hasLoadedOnce = true;
    }

    @Mutation
    authError() {
        localStorage.removeItem('user-token');
        this.status = 'error';
        this.hasLoadedOnce = true;
    }

    @Mutation
    authLogoutMutation() {
        this.token = '';
    }
}

export const AuthModule: Auth = getModule(Auth);