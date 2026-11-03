import { defineStore } from "pinia";
import { computed, ref, watchEffect } from "vue";
import { usePreferredDark } from "@vueuse/core";

export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme';
const LEGACY_STORAGE_KEY = 'dark';

const readPreference = (): ThemePreference => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
    // Migración de la clave antigua ("true" / "false")
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy === 'true') return 'dark';
    if (legacy === 'false') return 'light';
  } catch {
    // localStorage no disponible
  }
  return 'system';
}

export const useThemeStore = defineStore("theme", () => {
  const preference = ref<ThemePreference>(readPreference());
  const systemPrefersDark = usePreferredDark();

  const darkMode = computed(() =>
    preference.value === 'system' ? systemPrefersDark.value : preference.value === 'dark'
  );

  const setPreference = (value: ThemePreference) => {
    preference.value = value;
    try {
      localStorage.setItem(STORAGE_KEY, value);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // localStorage no disponible
    }
  }

  const setDarkMode = (dark: boolean) => setPreference(dark ? 'dark' : 'light');

  const toggleDarkMode = () => setDarkMode(!darkMode.value);

  watchEffect(() => {
    const dark = darkMode.value;
    const root = document.documentElement;
    root.classList.toggle('dark', dark);
    root.style.colorScheme = dark ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', dark ? '#1f2937' : '#ffffff');
  });

  return {
    preference,
    darkMode,
    toggleDarkMode,
    setDarkMode,
    setPreference
  }
})
