import {computed} from "vue";
import {RouteLocationRaw, RouteParams, useRoute} from "vue-router";
import {usePageStore} from "@/store/pageStore";

export interface Crumb {
  title: string;
  to: RouteLocationRaw;
  isLast: boolean;
}

/**
 * Sustituye los `:param` (con modificadores opcionales) de un path de ruta por los valores actuales.
 * `router.resolve` ignora `params` cuando se le pasa un `path`, y los padres anidados no tienen nombre.
 */
function fillPath(path: string, params: RouteParams): string {
  return path.replace(/\/:(\w+)(?:\([^)]*\))?[?*+]?/g, (_, name: string) => {
    const value = params[name];
    const text = Array.isArray(value) ? value.join("/") : value;
    return text ? `/${encodeURIComponent(text)}` : "";
  }) || "/";
}

/**
 * Calcula el breadcrumb de la ruta actual a partir de `route.matched`.
 * El título del último nivel puede sobrescribirse con `pageStore.title`.
 */
export default function useBreadcrumbs() {
  const route = useRoute();
  const pageStore = usePageStore();

  const crumbs = computed<Crumb[]>(() => {
    const levels: { title: string; path: string }[] = [];

    for (const record of route.matched) {
      const title = record.meta.title;
      if (!title || record.meta.breadcrumb === false) continue;
      // El padre y su hijo '' suelen compartir título: solo se muestra uno
      if (levels.length && levels[levels.length - 1].title === title) continue;
      levels.push({title, path: record.path});
    }

    return levels.map((level, index) => {
      const isLast = index === levels.length - 1;
      return {
        title: isLast ? (pageStore.title ?? level.title) : level.title,
        to: fillPath(level.path, route.params),
        isLast
      };
    });
  });

  /** Nivel al que volver desde la página actual, si existe */
  const parent = computed(() => crumbs.value.length > 1 ? crumbs.value[crumbs.value.length - 2] : undefined);

  return {crumbs, parent};
}
