<template>
    <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
            <li>
                <router-link :to="{name: 'home'}">PrognoSports</router-link>
            </li>

            <li v-for="(crumb, index) in crumbs" :class="{ 'is-active': crumb.isLast}">
                <router-link :to="{path: crumb.target, params: crumb.params}">{{ crumb.title }}</router-link>
            </li>
        </ul>
    </nav>
</template>

<script lang="ts">
import {RouteParams, RouteRecord, useRoute, useRouter} from "vue-router";
import {defineComponent, onMounted, ref} from "vue";
import useEmitter from "@/composables/useEmitter";

interface BreadcrumbRoute extends RouteRecord {
    parent: RouteRecord | undefined;
    params: RouteParams;
}

interface Crumb {
    title: string;
    isLast: boolean;
    target: string;
    params: RouteParams;
}

export default defineComponent({
    setup() {
        const emitter = useEmitter();
        const router = useRouter();
        const route = useRoute();

        const crumbs = ref([] as Array<Crumb>);

        /**
         * Calcular a partir de la ruta actual del componente su Breadcrumb
         */
        const calculateCrumbs = () => {
            let list: Crumb[] = [];

            const myRoute = router.getRoutes().find(r => r.name == route.name) as BreadcrumbRoute;
            myRoute.params = route.params;

            list.push(...findParents(myRoute).reverse());

            return list;
        }

        /**
         * Buscar recursivamente a los padres de la ruta y añadir aquellos que tengan un titulo a la lista de breadcrumb
         * @param route La ruta sobre la que buscar sus ancestros
         * @param parents Rutas ya agregadas, si existen
         */
        const findParents = (route: BreadcrumbRoute, parents: Crumb[] = []) => {
            if (route.meta!.title) {

                let crumb: Crumb = {
                    isLast: (parents.length == 0),
                    target: route.path,
                    title: route.meta!.title,
                    params: route.params
                }
                parents.push(crumb);
            }

            if (route.parent != undefined) {
                findParents(route.parent as BreadcrumbRoute, parents);
            }

            return parents;
        }

        onMounted(() => {
            crumbs.value = calculateCrumbs();
            // Recibir eventos de otros componentes para sobreescribir el nombre del crumb actual
            // Por ejemplo, "Detalles del Circuito" puede ser sustitido por "Autodromo Nazionale di Monza"
            emitter.on('breadcrumbLastname', (name: string) => {
                crumbs.value.forEach(crumb => {
                    if (crumb.isLast) {
                        crumb.title = name;
                    }
                })
            });
        });
        return {emitter, crumbs}
    },
});
</script>