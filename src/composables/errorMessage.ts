/**
 * Mensaje de un error rechazado por el cliente de la API. El interceptor de axios rechaza con un objeto plano
 * `{ message }` (no con un `Error`), y `message` es undefined cuando no hubo respuesta del servidor (red caída).
 */
export function errorMessage(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "message" in error) {
    const { message } = error as { message: unknown };
    return typeof message === "string" ? message : undefined;
  }
  return undefined;
}
