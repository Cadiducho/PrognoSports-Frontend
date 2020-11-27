import {User} from "@/types/User";
import {NotificationData} from "@/types/NotificationData";

enum NotificationType {
    INFO = "info",
    QUALI_PRE_ALERT = "quali-pre-alert",
    QUALI_ALERT = "quali-alert",
    RACE_PRE_ALERT = "race-pre-alert",
    RACE_ALERT = "race-alert",
    QUALI_POINTS = "quali-points",
    GRID_CHANGES = "grid-changes",
    RACE_POINTS = "race-points"
}

export interface Notification {
    id: string;
    to: User;
    senderUser: User;
    readAt: Date;
    type: NotificationType;
    data: NotificationData;
}