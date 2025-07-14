
<template>
  <div
    id="circuitlist"
    class="box"
  >
    <PTitle
      class="mb-5"
      name="Lista de Circuitos"
    />
    <div v-if="isLoading">
      <loading />
    </div>
    <div v-else>
      <PField>
        <PInput
          v-model="filtroCircuit"
          placeholder="Buscar circuito"
          type="search"
          icon="fas fa-search"
        />
      </PField>
      <div class="flex flex-wrap -mx-4">
        <ViewCircuitItem
          v-for="(circuit, index) in filteredCircuits"
          :key="index"
          :circuit="circuit"
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
import PField from "@/components/lib/forms/PField.vue";
import PInput from "@/components/lib/forms/PInput.vue";

export default defineComponent({
    name: "CircuitList",
    components: {
      PInput, PField,
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
    }
});
</script>
