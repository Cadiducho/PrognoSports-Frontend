import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiresCommunity?: boolean;
    requiresAdmin?: boolean;
    /** Título de la página: se usa en la cabecera, el breadcrumb y document.title */
    title?: string;
    /** Con `false`, este nivel no aparece en el breadcrumb */
    breadcrumb?: false;
  }
}
