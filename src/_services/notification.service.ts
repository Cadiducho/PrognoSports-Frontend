import axios from 'axios';
import {Notification} from "@/types/Notification";

export class NotificationService {
    public async getNotifications(): Promise<Array<Notification>> {
        return await axios.get('/notifications');
    }

    public async clearNotifications(): Promise<void> {
        return await axios.delete('/notifications');
    }
}
