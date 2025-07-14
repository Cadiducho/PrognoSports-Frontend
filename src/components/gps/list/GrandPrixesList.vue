<template>
  <PField>
    <PInput
      v-model="filtroGps"
      placeholder="Buscar Gran Premio"
      type="search"
      icon="fas fa-search"
    />
  </PField>
  <div class="flex flex-wrap -mx-4">
    <div v-if="gps.length === 0">
      No hay grandes premios aquí... de momento
    </div>
    <GrandPrixItem
      v-for="(grandprix, index) in filteredGrandPrixes"
      :key="grandprix.name + index"
      class=""
      :gp="grandprix"
    />
  </div>
</template>

<script lang="ts">
    import GrandPrixItem from "@/components/gps/list/GrandPrixItem.vue";
    import {GrandPrix} from "@/types/GrandPrix";

    import {defineComponent, PropType} from "vue";
    import PField from "@/components/lib/forms/PField.vue";
    import PInput from "@/components/lib/forms/PInput.vue";

    export default defineComponent({
        name: "GrandPrixesList",
        components: {PInput, PField, GrandPrixItem},
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
                        gp.circuit?.name
                            .toLowerCase()
                            .includes(filtroLowerCase) ||
                        gp.circuit?.country
                            .toLowerCase()
                            .includes(filtroLowerCase) ||
                        gp.circuit?.locality
                            .toLowerCase()
                            .includes(filtroLowerCase)
                    );
                });
            }
        }
    });
</script>
