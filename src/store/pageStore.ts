import {defineStore} from "pinia";
import {ref} from "vue";

/**
 * Estado de la página actual. `title` sobrescribe el título definido en `route.meta.title`
 * cuando este depende de datos cargados (por ejemplo, el nombre de un circuito).
 */
export const usePageStore = defineStore('page', () => {
  const title = ref<string | undefined>(undefined);
  // Quién fijó el título, para que una página que se desmonta no borre el de otra
  const owner = ref<symbol | undefined>(undefined);

  function setTitle(newOwner: symbol, newTitle: string | undefined) {
    owner.value = newOwner;
    title.value = newTitle;
  }

  function clearTitle(fromOwner: symbol) {
    if (owner.value !== fromOwner) return;
    owner.value = undefined;
    title.value = undefined;
  }

  return {
    title,
    setTitle,
    clearTitle
  }
});
