import { userService } from '@/_services';
import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import store from "@/_store";
import {User} from "@/types/User";
import {CommunityModule} from "@/_store/modules/CommunityModule";
import {AuthModule} from "@/_store/modules/AuthModule";
import {router} from "@/router";

export interface IUserState {
    status: string,
    profile: User,
    registeredMail: string,
}

@Module({dynamic: true, store: store, namespaced: true, name: 'user' })
class UserMod extends VuexModule implements IUserState {
    status = '';
    profile: User = {} as User;
    registeredMail = '';

    get getProfile(): User {
        return this.profile;
    }

    get isProfileLoaded(): boolean {
        if (this.profile.id === undefined) return false;
        return !!this.profile.username;
    }

    get getRegistedMail() {
        return this.registeredMail;
    }

    @Action
    async userRequest() {
        this.userRequestStart();
        userService.getMe()
            .then(user => {
                this.userRequestSuccess(user);
                if (!CommunityModule.thereIsCurrentCommunity) {
                    // Si no hay comunidad guardada en el estado, intentar poner la que tiene por defecto el getMe()
                    CommunityModule.setCurrentUserCommunity(user.currentCommunity);
                }
            })
            .catch(resp => {
                this.userRequestError();
                console.log("Auth error..." + resp);
                // if resp is unauthorized, logout, to
                AuthModule.logout().then(() => {
                    router.push({name: 'login'});
                });
            })
    }

    @Action
    async userRegister(payload: {email: string, username: string, password: string}) {
        let {email, username, password} = payload;
        return new Promise((resolve, reject) => {
            this.userRegisterStart();
            userService.register(email, username, password)
                .then(
                    token => {
                        this.userRegisterSuccess(email);
                        resolve(email);
                    },
                    error => {
                        this.userRegisterError()
                        console.log("Register error..." + error);
                        reject(error);
                    });
        });
    }

    @Action
    async userForgotPassword(email: string) {
        return new Promise((resolve, reject) => {
            userService.sendForgotPassword(email)
                .then(
                    () => {
                        resolve();
                    },
                    error => {
                        this.removeRegisteredMailState();
                        reject(error);
                    });
        });
    }

    @Action
    async userChangePassword(email: string, inputToken: string, inputPassword: string) {
        return new Promise((resolve, reject) => {
            userService.changePassword(email, inputToken, inputPassword)
                .then(
                    () => {
                        this.userChangePasswordSuccess(email);
                        resolve();
                    },
                    error => {
                        this.removeRegisteredMailState();
                        reject(error);
                    });
        });
    }

    @Mutation
    userRequestStart() {
        this.status = 'loading';
    }

    @Mutation
    userRequestSuccess(user: User) {
        this.profile = user;
        this.status = 'success';
    }

    @Mutation
    userRequestError() {
        this.status = 'error';
    }

    @Mutation
    authLogout() {
        this.profile = {} as User;
    }

    @Mutation
    userRegisterStart() {
        this.status = 'loading';
    }

    @Mutation
    userRegisterSuccess(email: string) {
        this.status = 'success';
        this.registeredMail = email;
    }

    @Mutation
    userRegisterError() {
        this.status = 'error';
    }

    @Mutation
    userChangePasswordSuccess(email: string) {
        this.registeredMail = email;
    }

    @Mutation
    removeRegisteredMailState() {
        this.registeredMail = '';
    }
}

export const UserModule: UserMod = getModule(UserMod);