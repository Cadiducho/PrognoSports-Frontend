import axios from 'axios';

export const notificationService = {
    getNotifications,
    clearNotifications
};

function getNotifications() {
    return axios.get('/notifications');
}
function clearNotifications() {
    return axios.delete('/notifications');
}