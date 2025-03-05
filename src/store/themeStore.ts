import { defineStore } from "pinia";
import {ref} from "vue";

export const useThemeStore = defineStore("theme", () => {
  const darkMode = ref(localStorage.getItem("dark") === "true");

  const toggleDarkMode = () => {
    setDarkMode(!darkMode.value);
  }

  const setDarkMode = (dark: boolean) => {
    console.log('setDarkMode', dark);
    darkMode.value = dark;
    localStorage.setItem('dark', dark.toString());
    if (dark) {
      document.documentElement.classList.add('dark');
      console.log('dark mode added')
    } else {
      document.documentElement.classList.remove('dark');
      console.log('dark mode removed')
    }
  }

  return {
    darkMode,
    toggleDarkMode,
    setDarkMode
  }
})
