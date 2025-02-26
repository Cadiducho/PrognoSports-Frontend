import axios from 'axios';
import {INotification, Notification} from "@/types/Notification";
import {PrognoService} from "@/_services/progno.service";
import {toast} from 'vue-sonner'
import {Position, ToastTypes} from "vue-sonner/lib/types";
import {useToastStore} from "@/store/toastStore";
import {Dictionary} from "@/types/Dictionary";

export class NotificationService extends PrognoService<INotification, Notification> {

  factory(data: INotification): Notification {
    return new Notification(data);
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

  /**
   * Actualizar una preferencia ´de las notificaciones del usuario en el servidor
   * @param type El tipo de notificación
   * @param method El método de la notificación, por ejemplo, email o telegram
   * @param value El valor a cambiar. True si activada, False si desactivada este tipo de notificación
   */
  public async changeNotificationPreference(type: string, method: string, value: boolean): Promise<string> {
    const payload = {
      notification: `${type}-${method}`,
      toggleTo: value
    }
    return await axios.patch('/notifications/preferences', payload);
  }

  /**
   * Obtener la lista de zonas horarias soportadas
   */
  public async getTimeZonesList() {
    return await axios.get('/timezones');
  }

  /**
   * Mostrar una notificación en la web, un toast
   * @param message El mensaje
   * @param variant La variante o color de la notificación, por defecto success
   * @param position La posición del mensaje, por defecto top-right
   */
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
