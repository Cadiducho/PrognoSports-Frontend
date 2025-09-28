import {defineStore} from "pinia";
import {useLocalStorage} from "@vueuse/core";

export const useAppStore = defineStore('app', () => {
  const showAdvancedStadistics = useLocalStorage('scoreTablePreferences/showAdvancedStadistics', false);
  const showResults = useLocalStorage('scoreTablePreferences/showResults', true);
  const showUserColor = useLocalStorage('scoreTablePreferences/showUserColor', true);
  const showWinnerColor = useLocalStorage('scoreTablePreferences/showWinnerColor', true);

  return {
    showAdvancedStadistics,
    showResults,
    showUserColor,
    showWinnerColor
  }
})
