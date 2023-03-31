import axios from 'axios';
import {INotification, Notification} from "@/types/Notification";
import {PrognoService} from "@/_services/progno.service";
import { toast } from 'vue-sonner'
import {Position, ToastTypes} from "vue-sonner/lib/types";
import {useToastStore} from "@/store/toastStore";

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

    public showNotification(message: string,
                            variant: ToastTypes = "success",
                            position: Position = "top-right") {

        const toastStore = useToastStore();
        toastStore.position = position;

        switch (variant) {
            case "error":
                toast.error(message);
                return;
            case "success":
                toast.success(message);
                return;
        }

        toast.message(message);
    }
}
