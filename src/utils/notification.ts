import dayjs from "dayjs";
import {type Notification, NotificationType} from "@/types/Notification";

function sessionName(notification: Pick<Notification, 'data'>): string {
  return notification.data.session?.name ?? "Sesión";
}

/**
 * Enlace al Gran Premio a partir del href que envía el backend (que ya usa el id del GP, como la ruta).
 * Se usa solo la ruta para no salir de la aplicación (ni ir a producción desde local)
 */
function grandPrixAnchor(data: Notification['data']): string {
  if (!data.href) {
    return data.gpName;
  }
  const url = new URL(data.href, window.location.origin);
  return `<a href='${url.pathname}'>${data.gpName}</a>`;
}

export function notificationTitle(notification: Pick<Notification, 'id' | 'type' | 'data'>): string {
  switch (notification.type.toString().toLowerCase()) {
    case NotificationType.INFO:
      return "Info #" + notification.id;
    case NotificationType.SESSION_PRE_ALERT:
      return sessionName(notification) + " mañana";
    case NotificationType.SESSION_ALERT:
      return sessionName(notification) + " hoy";
    case NotificationType.GRID_CHANGES:
      return "Cambios en la parrila";
    case NotificationType.POINTS_DISPATCHED:
      return "Puntos de " + sessionName(notification);
    default:
      return "Notificación " + notification.id;
  }
}

export function notificationBody(notification: Pick<Notification, 'type' | 'data'>): string {
  const data = notification.data;
  switch (notification.type.toString().toLowerCase()) {
    case NotificationType.INFO:
      return data.href
        ? `${data.info} ${grandPrixAnchor(data)}`
        : data.info;
    case NotificationType.SESSION_PRE_ALERT:
    case NotificationType.SESSION_ALERT:
      return `Realiza tus pronósticos para ${grandPrixAnchor(data)} antes del ${dayjs.tz(data.time).format('D/M/YY [a las] H:mm')}`;
    case NotificationType.GRID_CHANGES:
      return "Se han producido cambios en la parrilla de salida de " + data.gpName;
    case NotificationType.POINTS_DISPATCHED: {
      if (!data.points || Object.keys(data.points).length == 0) {
        return "No has recibido puntos";
      }
      let mensaje = "";
      for (const communityName in data.points) {
        const points = data.points[communityName];
        if (points && data.session) {
          mensaje += `<strong class='text-info-600 dark:text-info-400'>${communityName}</strong>: ${points.pointsBySession[data.session.id]} puntos. <br/>Acumulados un total de ${points.accumulatedPoints} puntos esta temporada<br/>`;
        } else {
          mensaje += `<strong class='text-info-600 dark:text-info-400'>${communityName}</strong>: No has recibido puntos<br/>`;
        }
      }
      return mensaje;
    }
    default:
      return "Notificación deconocida";
  }
}
