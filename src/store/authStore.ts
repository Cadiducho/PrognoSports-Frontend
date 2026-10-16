import {defineStore} from 'pinia'
import {User} from "@/types/User";
import {authService, userService} from "@/_services";
import type {ApiError} from "@/_services";
import {useCommunityStore} from "@/store/communityStore";

// Petición del usuario en curso. Si varias navegaciones o componentes lo piden a la vez, comparten la misma petición
let loadingUser: Promise<User | null> | null = null;

export const useAuthStore = defineStore('auth', {

    state: () => ({
        user: null as User | null,
        mail: "",
        token: localStorage.getItem('token') ?? null,
        // Cuándo se cargó el usuario por última vez (ms), para saber si conviene revalidarlo
        userLoadedAt: 0,
    }),
    getters: {
        isLoggedIn(): boolean {
            return this.user !== null;
        },
        loggedUser(): User | null {
            return this.user;
        },
    },
    actions: {
        /**
         * El usuario con la sesión iniciada, para código que solo se ejecuta con sesión (rutas con requiresAuth).
         * Falla si no hay usuario, en lugar de devolver un usuario vacío.
         */
        requireUser(): User {
            if (!this.user) {
                throw new Error("No hay ningún usuario con la sesión iniciada");
            }
            return this.user;
        },
        changeMailState(mail: string): void {
            this.mail = mail;
        },
        setToken(token: string): void {
            this.token = token;
            localStorage.setItem('token', token);
        },
        /** Olvida el token y el usuario */
        clearSession(): void {
            this.user = null;
            this.userLoadedAt = 0;
            this.token = null;
            localStorage.removeItem('token');
        },
        /**
         * Guarda el usuario cargado. Si es el mismo usuario se actualiza el objeto actual en lugar de sustituirlo,
         * para que los componentes que ya tienen una referencia a él vean los cambios.
         */
        setUser(user: User): void {
            if (this.user && this.user.id === user.id) {
                const current = this.user as unknown as Record<string, unknown>;
                for (const key of Object.keys(current)) {
                    if (!(key in user)) {
                        delete current[key];
                    }
                }
                Object.assign(current, user);
            } else {
                this.user = user;
            }
            this.userLoadedAt = Date.now();
        },
        /**
         * Carga el usuario con la sesión iniciada desde la API, una sola vez: si ya está cargado no vuelve a pedirlo.
         * @param force Pedirlo de nuevo aunque ya esté cargado, por ejemplo tras cambiar sus datos
         * @return El usuario, o null si no hay sesión
         */
        loadUser(force: boolean = false): Promise<User | null> {
            if (!this.token) {
                return Promise.resolve(null);
            }
            if (this.user && !force) {
                return Promise.resolve(this.user);
            }

            if (!loadingUser) {
                const token = this.token;
                loadingUser = userService.getMe().then(user => {
                    // Si mientras tanto se cerró la sesión, no se vuelve a guardar el usuario
                    if (this.token !== token) {
                        return null;
                    }
                    this.setUser(user);
                    return user;
                }).catch((error: ApiError) => {
                    // /user/me no recibe credenciales: un 401 es siempre un token caducado o rechazado
                    if (error?.status === 401) {
                        this.signOut();
                    }
                    throw error;
                }).finally(() => {
                    loadingUser = null;
                });
            }
            return loadingUser;
        },
        async login(payload: { username: string, password: string }): Promise<string> {
            const {username, password} = payload;
            try {
                const token = await authService.login(username, password);
                this.setToken(token);
                this.changeMailState(""); // Ya no guardar el mail state tras el login correcto
                await this.loadUser(true);
                return token;
            } catch (error) {
                this.clearSession();
                throw error;
            }
        },
        /** Cierra la sesión: olvida el token, el usuario y la comunidad actual */
        signOut(): void {
            this.clearSession();
            useCommunityStore().removeCurrentCommunity();
        },
        register(payload: { username: string, email: string, password: string }): Promise<any> {
            const {username, email, password} = payload;
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
    },
});
