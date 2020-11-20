import axios from 'axios';
import {Notification} from "@/types/Notification";

export const notificationService = {
    getNotifications,
    clearNotifications
};

async function getNotifications(): Promise<Array<Notification>> {
    return await axios.get('/notifications');
}

async function clearNotifications(): Promise<void> {
    return await axios.delete('/notifications');
}