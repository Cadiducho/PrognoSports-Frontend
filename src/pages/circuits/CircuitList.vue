
<template>
    <div id="circuitlist" class="box">
        <PTitle class="mb-5" name="Lista de Circuitos" />
        <div v-if="isLoading"><loading /></div>
        <div v-else>
            <o-field>
                <o-input
                    v-model="filtroCircuit"
                    placeholder="Buscar circuito"
                    type="search"
                    icon-pack="fas"
                    icon="search"
                ></o-input>
            </o-field>
            <div class="flex flex-wrap -mx-4">
                <ViewCircuitItem
                    v-for="(circuit, index) in filteredCircuits"
                    :circuit="circuit"
                    v-bind:key="index"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import ViewCircuitItem from "@/components/circuits/ViewCircuitItem.vue";
import PTitle from "@/components/lib/PTitle.vue";
import { Circuit } from "@/types/Circuit";
import { circuitService } from "@/_services";
import {defineComponent} from "vue";
import Loading from "@/components/lib/Loading.vue";

export default defineComponent({
    name: "CircuitList",
    components: {
        Loading,
        ViewCircuitItem,
        PTitle,
    },
    data() {
        return {
            circuitList: new Array<Circuit>(),
            filtroCircuit: '',
            isLoading: true,
        }
    },
    created() {
        this.loadCircuits();
    },
    methods: {
        loadCircuits() {
            circuitService.getCircuitList().then((circuits) => {
                this.circuitList.push(...circuits);
                this.isLoading = false;
            });
        }
    },
    computed: {
        filteredCircuits(): Array<Circuit> {
            if (!this.filtroCircuit.trim()) {
                return this.circuitList;
            }

            const filtroLowerCase: string = this.filtroCircuit.toLowerCase().trim();

            return this.circuitList.filter((circuit) => {
                return (
                    circuit.name
                        .toLowerCase()
                        .includes(filtroLowerCase) ||
                    circuit.country
                        .toLowerCase()
                        .includes(filtroLowerCase) ||
                    circuit.locality
                        .toLowerCase()
                        .includes(filtroLowerCase) ||
                    circuit.variants.map(v => v.name.toLowerCase()).some(v => v.includes(filtroLowerCase))
                );
            });
        }
    }
});
</script>