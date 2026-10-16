import dayjs from "dayjs";
import type {Notification} from "@/types/Notification";

export function notificationTitle(notification: Pick<Notification, 'id' | 'type'>): string {
  switch (notification.type.toString()) {
    case 'INFO':
      return "Info #" + notification.id;
    case 'QUALI_PRE_ALERT':
      return "Clasificación mañana";
    case 'QUALI_ALERT':
      return "Clasificación hoy";
    case 'RACE_PRE_ALERT':
      return "Carrera mañana";
    case 'RACE_ALERT':
      return "Carrera hoy";
    case 'QUALI_POINTS':
      return "Puntos de clasificación";
    case 'GRID_CHANGES':
      return "Cambios en la parrila";
    case 'RACE_POINTS':
      return "Puntos del Gran Premio";
    default:
      return "Notificación " + notification.id;
  }
}

export function notificationBody(notification: Pick<Notification, 'type' | 'data'>): string {
  const data = notification.data;
  switch (notification.type.toString()) {
    case 'INFO':
      return data.info;
    case 'QUALI_PRE_ALERT':
    case 'QUALI_ALERT':
    case 'RACE_PRE_ALERT':
    case 'RACE_ALERT':
      return `Realiza tus pronósticos para <a href='/gps/${data.competition}/${data.gpSeason}/${data.gpRound}'>${data.gpName}</a> antes del ${dayjs.tz(data.time).format('D/M/YY [a las] H:mm')}`;
    case 'GRID_CHANGES':
      return "Se han producido cambios en la parrilla de salida de " + data.gpName;
    case 'QUALI_POINTS': {
      if (Object.keys(data.points).length == 0) {
        return "No has recibido puntos";
      }
      let mensaje = "";
      for (const communityName in data.points) {
        mensaje += communityName;
        const points = data.points[communityName];
        if (points) {
          mensaje += `<strong class='text-info-600 dark:text-info-400'>${communityName}</strong>: ${points.pointsBySession["QUALIFY"]}  puntos. <br/>Acumulados un total de ${points.accumulatedPoints} puntos esta temporada`;
        } else {
          mensaje += "No has recibido puntos";
        }
      }
      return mensaje;
    }
    case 'RACE_POINTS': {
      if (Object.keys(data.points).length == 0) {
        return "No has recibido puntos";
      }
      let mensaje = "";
      for (const communityName in data.points) {
        mensaje += communityName;
        const points = data.points[communityName];
        if (points) {
          mensaje += `<strong class='text-info-600 dark:text-info-400'>${communityName}</strong>: ${points.pointsBySession["RACE"]} puntos. <br/>Acumulados un total de ${points.accumulatedPoints} puntos esta temporada`;
        } else {
          mensaje += "No has recibido puntos";
        }
      }
      return mensaje;
    }
    default:
      return "Notificación deconocida";
  }
}
