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
import {Component, Vue} from "vue-property-decorator";
import {RouteRecordPublic} from "vue-router";
import EventBus from "@/plugins/eventbus";

type Dictionary<T> = { [key: string]: T }
interface BreadcrumbRoute extends RouteRecordPublic {
    parent: RouteRecordPublic | undefined;
    params: Dictionary<string>;
}

interface Crumb {
    title: string;
    isLast: boolean;
    target: string;
    params: Dictionary<string>;
}

@Component
export default class Breadcrumb extends Vue {

    crumbs: Array<Crumb> = [];

    mounted() {
        this.crumbs = this.calculateCrumbs();

        // Recibir eventos de otros componentes para sobreescribir el nombre del crumb actual
        // Por ejemplo, "Detalles del Circuito" puede ser sustitido por "Autodromo Nazionale di Monza"
        EventBus.$on('breadcrumbLastname', (name: string) => {
            this.crumbs.forEach(crumb => {
                if (crumb.isLast) {
                    crumb.title = name;
                }
            })
        });
    }

    /**
     * Calcular a partir de la ruta actual del componente su Breadcrumb
     */
    calculateCrumbs(): Array<Crumb> {
        let list: Crumb[] = [];

        const myRoute = this.$router.getRoutes().find(r => r.name == this.$route.name) as BreadcrumbRoute;
        myRoute.params = this.$route.params;

        list.push(...this.findParents(myRoute).reverse());

        return list;
    }

    /**
     * Buscar recursivamente a los padres de la ruta y añadir aquellos que tengan un titulo a la lista de breadcrumb
     * @param route La ruta sobre la que buscar sus ancestros
     * @param parents Rutas ya agregadas, si existen
     */
    findParents(route: BreadcrumbRoute, parents: Crumb[] = []): Array<Crumb> {
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
            this.findParents(route.parent as BreadcrumbRoute, parents);
        }

        return parents;
    }

}
</script>