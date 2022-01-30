import axios from 'axios';
import {INotification, Notification} from "@/types/Notification";
import {PrognoService} from "@/_services/progno.service";

export class NotificationService extends PrognoService<INotification, Notification> {

    factory(data: INotification): Notification {
        return new Notification(data);
    }

    public async getNotifications(): Promise<Array<Notification>> {
        return this.getObjectFromAPI("/notifications");
    }

    public async clearNotifications(): Promise<void> {
        return await axios.delete('/notifications');
    }
}
/*

    public async getNotifications(): Promise<Array<Notification>> {
        return new Promise(((resolve, reject) => {
            let lista: Array<Notification> = [];
            this.getNotificationsJson().then(objects => {
                objects.forEach(obj => {
                    lista.push(new Notification(obj));
                })
                resolve(lista);
            }).catch(reason => reject(reason));
        }));
    }

    private async getNotificationsJson(): Promise<Array<INotification>> {
        return await axios.get('/notifications');
    }
}
*/
