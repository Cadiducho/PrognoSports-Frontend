
<template>
    <div id="circuitlist" class="box">
        <progno-page-title name="Lista de Circuitos" />
        <div class=" mt-5 columns is-centered is-multiline">
            <view-circuit-item />
            <view-circuit-item /> <view-circuit-item /> <view-circuit-item />
            <view-circuit-item /> <view-circuit-item /> <view-circuit-item />
            <view-circuit-item /> <view-circuit-item /> <view-circuit-item />
            <view-circuit-item /> <view-circuit-item /> <view-circuit-item />
            <view-circuit-item /> <view-circuit-item /> <view-circuit-item />
            <view-circuit-item /> <view-circuit-item />
        </div>
        </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ViewCircuitItem from "@/views/circuit/ViewCircuitItem.vue";
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";

@Component<ViewCircuitList>({
    components: {
        ViewCircuitItem,
        PrognoPageTitle,
    },
})
export default class ViewCircuitList extends Vue {

    

}
</script>