import {defineStore} from 'pinia'
import {User} from "@/types/User";
import {authService, userService} from "@/_services";
import type {ApiError} from "@/_services";
import {useCommunityStore} from "@/store/communityStore";

// Petición del usuario en curso y el token con el que se hizo. Si varias navegaciones o componentes lo piden a la vez
// con el mismo token, comparten la misma petición
let loadingUser: Promise<User | null> | null = null;
let loadingUserToken: string | null = null;

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
        /**
         * Olvida el token y el usuario.
         * localStorage se comparte entre pestañas: si guarda otro token, es una sesión iniciada en otra pestaña y no se borra.
         * @return Si se ha borrado la sesión guardada en localStorage
         */
        clearSession(): boolean {
            const storedToken = localStorage.getItem('token');
            const ownsStorage = storedToken === null || storedToken === this.token;
            this.user = null;
            this.userLoadedAt = 0;
            this.token = null;
            if (ownsStorage) {
                localStorage.removeItem('token');
            }
            return ownsStorage;
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

            if (!loadingUser || loadingUserToken !== this.token) {
                const token = this.token;
                const request: Promise<User | null> = userService.getMe().then(user => {
                    // Si mientras tanto se cerró la sesión, no se vuelve a guardar el usuario
                    if (this.token !== token) {
                        return null;
                    }
                    this.setUser(user);
                    return user;
                }).catch((error: ApiError) => {
                    // /user/me no recibe credenciales: un 401 es siempre un token caducado o rechazado. Si mientras tanto
                    // se cambió de token (por ejemplo, un nuevo login), el rechazo del antiguo no cierra la sesión nueva.
                    if (error?.status === 401 && this.token === token) {
                        this.signOut();
                    }
                    throw error;
                }).finally(() => {
                    if (loadingUser === request) {
                        loadingUser = null;
                        loadingUserToken = null;
                    }
                });
                loadingUser = request;
                loadingUserToken = token;
            }
            return loadingUser;
        },
        async login(payload: { username: string, password: string }): Promise<string> {
            const {username, password} = payload;
            try {
                const token = await authService.login(username, password);
                this.setToken(token);
                this.changeMailState(""); // Ya no guardar el mail state tras el login correcto
            } catch (error) {
                this.clearSession();
                throw error;
            }

            try {
                await this.loadUser(true);
            } catch (error) {
                // Si el servidor rechaza el token, loadUser ya ha cerrado la sesión y el login falla.
                // Cualquier otro fallo (red, 5xx) no invalida el token: el guard de datos lo reintenta al navegar.
                if ((error as ApiError)?.status === 401) {
                    throw error;
                }
                console.error(error);
            }
            return token;
        },
        /** Cierra la sesión: olvida el token, el usuario y la comunidad actual */
        signOut(): void {
            // Si localStorage guarda la sesión de otra pestaña, su comunidad tampoco se borra
            const ownsStorage = this.clearSession();
            useCommunityStore().removeCurrentCommunity(ownsStorage);
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
