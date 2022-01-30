import {User} from "@/types/User";
import {NotificationData} from "@/types/NotificationData";
import dayjs from "dayjs";

enum NotificationType {
    INFO = 'info',
    QUALI_PRE_ALERT = 'quali-pre-alert',
    QUALI_ALERT = 'quali-alert',
    RACE_PRE_ALERT = 'race-pre-alert',
    RACE_ALERT = 'race-alert',
    QUALI_POINTS = 'quali-points',
    GRID_CHANGES = 'grid-changes',
    RACE_POINTS = 'race-points'
}

export interface INotification {
    id: string;
    to: User;
    readAt: Date | undefined;
    type: NotificationType;
    data: NotificationData;
    createdAt: Date;
}

export class Notification implements INotification {
    data: NotificationData;
    id: string;
    readAt: Date | undefined;
    to: User;
    type: NotificationType;
    createdAt: Date;

    constructor(notification: INotification) {
        this.data = notification.data;
        this.id = notification.id;
        this.readAt = notification.readAt;
        this.to = notification.to;
        this.type = notification.type;
        this.createdAt = notification.createdAt;
    }

    public title(): string {
        switch (this.type.toString()) {
            case 'INFO':
                return "Info #" + this.id;
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
                return "Notificación " + this.id;
        }
    }

    public body(): string {
        switch (this.type.toString()) {
            case 'INFO':
                return this.data.info;
            case 'QUALI_PRE_ALERT':
            case 'QUALI_ALERT':
            case 'RACE_PRE_ALERT':
            case 'RACE_ALERT':
                return `Realiza tus pronósticos para <a href='/gps/${this.data.competition}/${this.data.gpSeason}/${this.data.gpRound}'>${this.data.gpName}</a> antes del ${dayjs.tz(this.data.time).format('D/M/YY [a las] H:mm')}`;
            case 'GRID_CHANGES':
                return "Se han producido cambios en la parrilla de salida de " + this.data.gpName;
            case 'QUALI_POINTS': {
                let mensaje = "";
                this.data.points.forEach((points, community) => {
                    mensaje += `<strong class='has-text-info'>${community.name}</strong>: ${points.pointsInQualify} puntos. <br/>Acumulados un total de ${points.accumulatedPoints} puntos esta temporada`;
                })
                return mensaje;
            }
            case 'RACE_POINTS':
                let mensaje = "";
                this.data.points.forEach((points, community) => {
                    mensaje += `<strong class='has-text-info'>${community.name}</strong>: ${points.pointsInRace} puntos. <br/>Acumulados un total de ${points.accumulatedPoints} puntos esta temporada`;
                })
                return mensaje;
            default:
                return "Notificación deconocida";
        }
    }
}