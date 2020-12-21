
<template>
    <div id="circuitlist" class="box">
        <progno-page-title class="mb-5" name="Lista de Circuitos" />
        <div v-if="isLoading"><loading /></div>
        <div v-else>
            <b-field>
                <b-input
                    v-model="filtroCircuit"
                    placeholder="Buscar circuito"
                    type="search"
                    icon-pack="fas"
                    icon="search"
                ></b-input>
            </b-field>
            <div class="mt-5 columns is-centered is-multiline">
                <view-circuit-item
                    v-for="(circuit, index) in filteredCircuits"
                    :circuit="circuit"
                    v-bind:key="index"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ViewCircuitItem from "@/views/circuit/ViewCircuitItem.vue";
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import { Circuit } from "@/types/Circuit";
import { circuitService } from "@/_services";

@Component<ViewCircuitList>({
    components: {
        ViewCircuitItem,
        PrognoPageTitle,
    },
})
export default class ViewCircuitList extends Vue {
    private circuitList: Array<Circuit> = [];
    private filtroCircuit: String = '';
    private isLoading: boolean = true;

    created() {
        this.loadCircuits();
    }

    loadCircuits() {
        circuitService.getCircuitList().then((circuits) => {
            this.circuitList.push(...circuits);
            this.isLoading = false;
        });
    }

    get filteredCircuits(): Array<Circuit> {
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
                circuit.variant.name
                    .toLowerCase()
                    .includes(filtroLowerCase)
            );
        });
    }
}
</script>