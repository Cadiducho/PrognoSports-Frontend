import {User} from "@/types/User";
import {NotificationData} from "@/types/NotificationData";

export enum NotificationType {
    INFO = 'info',
    SESSION_PRE_ALERT = 'session-pre-alert',
    SESSION_ALERT = 'session-alert',
    GRID_CHANGES = 'grid-changes',
    POINTS_DISPATCHED = 'points-dispatched'
}

export interface Notification {
    id: string;
    to: User;
    readAt: Date | undefined;
    type: NotificationType;
    data: NotificationData;
    createdAt: Date;
}
