export function authHeader() {
    let token = localStorage.getItem('user-token');

    if (token) {
        return token;
    } else {
        return '';
    }
}