import {defineStore} from "pinia";
import {ref} from "vue";

/**
 * Estado de la página actual. `title` sobrescribe el título definido en `route.meta.title`
 * cuando este depende de datos cargados (por ejemplo, el nombre de un circuito).
 */
export const usePageStore = defineStore('page', () => {
  const title = ref<string | undefined>(undefined);

  return {
    title
  }
});
