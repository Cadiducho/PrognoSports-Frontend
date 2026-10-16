import type {Router} from "vue-router";
import {notificationService, setTokenProvider, setUnauthorizedHandler} from "@/_services";
import {useAuthStore} from "@/store/authStore";

/** Pasado este tiempo desde la última carga, el usuario se revalida al volver a la pestaña */
const REVALIDATE_USER_AFTER_MS = 5 * 60 * 1000;

/**
 * Conecta la sesión con el resto de la aplicación. Se llama una vez al arrancar, con Pinia ya instalado.
 * - El token que usan las peticiones sale del authStore.
 * - Si el servidor rechaza el token, se cierra la sesión y se manda al login.
 * - El usuario se revalida al volver a la pestaña tras un tiempo, ya que no se pide en cada navegación.
 */
export function installSession(router: Router) {
  const authStore = useAuthStore();

  setTokenProvider(() => authStore.token);

  let checkingSession = false;
  setUnauthorizedHandler(async () => {
    if (checkingSession || !authStore.isLoggedIn) {
      return;
    }
    checkingSession = true;
    try {
      // Un 401 también responde a una contraseña incorrecta (cambiar email o contraseña) y no implica que la sesión
      // haya caducado. Se pide el usuario: si el servidor rechaza el token, loadUser cierra la sesión.
      await authStore.loadUser(true);
    } catch {
      // Un fallo distinto de 401 (por ejemplo, sin conexión) no cierra la sesión
    } finally {
      checkingSession = false;
    }

    if (!authStore.isLoggedIn) {
      notificationService.showNotification("Tu sesión ha caducado. Inicia sesión de nuevo", "error");
      await router.push({name: 'login', query: {redirect: router.currentRoute.value.fullPath}});
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible' || !authStore.isLoggedIn) {
      return;
    }
    if (Date.now() - authStore.userLoadedAt < REVALIDATE_USER_AFTER_MS) {
      return;
    }
    // Si el token ya no vale, la petición hace saltar el manejador de 401; cualquier otro fallo se ignora
    authStore.loadUser(true).catch(() => undefined);
  });
}
