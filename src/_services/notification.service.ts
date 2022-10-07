import axios from 'axios';
import {INotification, Notification} from "@/types/Notification";
import {PrognoService} from "@/_services/progno.service";

export class NotificationService extends PrognoService<INotification, Notification> {

    factory(data: INotification): Notification {
        return new Notification(data);
    }

    public async getNotifications(): Promise<Array<Notification>> {
        return this.getObjectListFromAPI("/notifications");
    }

    public async clearNotifications(): Promise<void> {
        return await axios.delete('/notifications');
    }

    public async getNotificationMethods(): Promise<Array<string>> {
        return await axios.get('/notifications/methods');
    }
}
