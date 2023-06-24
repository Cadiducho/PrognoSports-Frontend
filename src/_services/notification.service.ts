import axios from 'axios';
import {INotification, Notification} from "@/types/Notification";
import {PrognoService} from "@/_services/progno.service";
import { toast } from 'vue-sonner'
import {Position, ToastTypes} from "vue-sonner/lib/types";
import {useToastStore} from "@/store/toastStore";
import {Dictionary} from "@/types/Dictionary";

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

    /**
     * Obtener un diccionario con los métodos de notificaciones disponibles. La clave es el nombre del método y el valor es la descripción.
     */
    public async getNotificationMethods(): Promise<Dictionary<string, string>> {
        return await axios.get('/notifications/methods');
    }

    /**
     * Obtener un diccionario con los tipos de notificaciones disponibles. La clave es el nombre del tipo y el valor es la descripción.
     */
    public async getNotificationTypes(): Promise<Dictionary<string, string>> {
        return await axios.get('/notifications/types');
    }

    public async changeNotificationPreference(type: string, method: string, value: boolean): Promise<string> {
        const payload = {
            notification: `${type}-${method}`,
            toggleTo: value
        }
        return await axios.patch('/notifications/preferences', payload);
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
