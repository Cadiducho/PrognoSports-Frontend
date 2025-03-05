import {defineStore} from "pinia";
import {Position} from "vue-sonner/lib/types";
import {ref} from "vue";

export const useToastStore = defineStore('toast', () => {
  const position = ref("top-center" as Position);

  return {
    position
  }
});
