<template>
    <o-field>
        <o-input
            v-model="filtroGps"
            placeholder="Buscar Gran Premio"
            type="search"
            icon-pack="fas"
            icon="search"
        ></o-input>
    </o-field>
    <div class="columns is-multiline is-3">
        <div v-if="gps.length === 0">
            No hay grandes premios aquí... de momento
        </div>
        <GrandPrixItem
            v-for="(grandprix, index) in filteredGrandPrixes"
            :gp="grandprix"
            :key="grandprix.name + index"
        />
    </div>
</template>

<script lang="ts">
    import GrandPrixItem from "@/components/gps/list/GrandPrixItem.vue";
    import {GrandPrix} from "@/types/GrandPrix";

    import {defineComponent, PropType} from "vue";

    export default defineComponent({
        name: "GrandPrixesList",
        components: {GrandPrixItem},
        props: {
            gps: {
                type: Object as PropType<Array<GrandPrix>>,
                required: true
            },
        },
        data() {
            return {
                filtroGps: '',
            }
        },
        computed: {
            filteredGrandPrixes(): Array<GrandPrix> {
                if (!this.filtroGps.trim()) {
                    return this.gps;
                }

                const filtroLowerCase: string = this.filtroGps.toLowerCase().trim();

                return this.gps.filter((gp) => {
                    return (
                        gp.name
                            .toLowerCase()
                            .includes(filtroLowerCase) ||
                        gp.code
                            .toLowerCase()
                            .includes(filtroLowerCase) ||
                        gp.circuit.name
                            .toLowerCase()
                            .includes(filtroLowerCase) ||
                        gp.circuit.country
                            .toLowerCase()
                            .includes(filtroLowerCase) ||
                        gp.circuit.locality
                            .toLowerCase()
                            .includes(filtroLowerCase)
                    );
                });
            }
        }
    });
</script>