import {User} from "@/types/User";
import {NotificationData} from "@/types/NotificationData";
import dayjs from "dayjs";

enum NotificationType {
    INFO = 'info',
    SESSION_PRE_ALERT = 'session-pre-alert',
    SESSION_ALERT = 'session-alert',
    GRID_CHANGES = 'grid-changes',
    POINTS_DISPATCHED = 'points-dispatched'
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
        switch (this.type.toString().toLowerCase()) {
            case NotificationType.INFO:
                return "Info #" + this.id;
            case NotificationType.SESSION_PRE_ALERT:
                return this.sessionName() + " mañana";
            case NotificationType.SESSION_ALERT:
                return this.sessionName() + " hoy";
            case NotificationType.GRID_CHANGES:
                return "Cambios en la parrila";
            case NotificationType.POINTS_DISPATCHED:
                return "Puntos de " + this.sessionName();
            default:
                return "Notificación " + this.id;
        }
    }

    public body(): string {
        switch (this.type.toString().toLowerCase()) {
            case NotificationType.INFO:
                return this.data.href
                    ? `${this.data.info} <a href='${this.data.href}'>${this.data.gpName}</a>`
                    : this.data.info;
            case NotificationType.SESSION_PRE_ALERT:
            case NotificationType.SESSION_ALERT:
                return `Realiza tus pronósticos para <a href='/gps/${this.data.competition}/${this.data.gpSeason}/${this.data.gpRound}'>${this.data.gpName}</a> antes del ${dayjs.tz(this.data.time).format('D/M/YY [a las] H:mm')}`;
            case NotificationType.GRID_CHANGES:
                return "Se han producido cambios en la parrilla de salida de " + this.data.gpName;
            case NotificationType.POINTS_DISPATCHED: {
                if (!this.data.points || Object.keys(this.data.points).length == 0) {
                    return "No has recibido puntos";
                }
                let mensaje = "";
                for (const communityName in this.data.points) {
                    const points = this.data.points[communityName];
                    if (points && this.data.session) {
                        mensaje += `<strong class='text-info-600 dark:text-info-400'>${communityName}</strong>: ${points.pointsBySession[this.data.session.id]} puntos. <br/>Acumulados un total de ${points.accumulatedPoints} puntos esta temporada<br/>`;
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

    private sessionName(): string {
        return this.data.session?.name ?? "Sesión";
    }
}
