import { defineStore } from "pinia";

export const useThemeStore = defineStore('theme', {
    state: () => ({
        darkMode: localStorage.getItem('dark') === 'true',
    }),
    getters: {
        isDarkMode(): boolean {
            return this.darkMode;
        }
    },
    actions: {
        toggleDarkMode(): void {
            this.setDarkMode(!this.darkMode);
        },
        setDarkMode(dark: boolean): void {
            console.log('setDarkMode', dark);
            this.darkMode = dark;
            localStorage.setItem('dark', dark.toString());
            if (dark) {
                document.documentElement.classList.add('dark');
                console.log('dark mode added')
            } else {
                document.documentElement.classList.remove('dark');
                console.log('dark mode removed')
            }
        }
    }
});