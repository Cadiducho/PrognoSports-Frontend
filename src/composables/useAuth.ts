import { useAuthStore } from "@/store/authStore";
import { notificationService } from "@/_services";
import { LocationQuery, LocationQueryValue, useRouter } from "vue-router";

/**
 * Wrapper para authStore. Interactúa con el store de autenticación y además con el router, notificaciones etc.
 */
export function useAuth() {

    const authStore = useAuthStore();
    const router = useRouter();

    const login = async (payload: { username: string, password: string }, redirectTo: LocationQueryValue | null) => {
        try {
            await authStore.login(payload);

            notificationService.showNotification("¡Has iniciado sesión correctamente!");
            if (redirectTo) {
                // Enviar a la redirección
                router.push(redirectTo as string);
            } else {
                // Redirigir al home en caso normal
                router.push({name: "home"});
            }
        } catch (error: any) {
            let message: string;
            if (error.code === 600) {
                message = "Fallo al iniciar sesión: Credenciales inválidas";
            } else {
                message = "Fallo al iniciar sesión: " + error.message;
            }
            notificationService.showNotification(message, 'error');
            throw error;
        }
    }

    const logout = async () => {
        await authStore.signOut();
        router.push({name: 'login'});
        notificationService.showNotification('Has cerrado sesión correctamente');
    }

    return { login, logout };
}
