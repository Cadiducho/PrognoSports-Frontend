<template>
    <article class="w-full sm:w-1/2 md:w-1/2 xl:w-1/5 p-4">
        <router-link
            :to="circuit.circuitLink()"
            class="c-card block bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden text-gray-700 hover:scale-110 transition ease-in-out delay-150 duration-300">

            <div class="relative pb-48 overflow-hidden">
                <img class="absolute inset-0 h-full w-full object-contain" :src="circuit.layoutImage()" alt="" />
            </div>

            <div class="p-4">
                <h2 class="mt-2 mb-2 font-bold">{{ circuit.name }}</h2>
                <p class="text-sm">{{ circuit.locality }} ({{ circuit.country }})</p>
            </div>

            <div class="p-4 border-t border-b text-xs text-gray-700">
                <span v-for="(variant, key) in circuit.variants" :key="key" class="flex justify-between items-center mb-1">
                    <b class="mr-1 flex">{{ variant.name }}:</b> {{ variant.distance }}km. ({{ variant.turns }} curvas)<br/>
                </span>
            </div>
        </router-link>
    </article>
</template>

<script lang="ts">
import { Circuit } from "@/types/Circuit";
import {defineComponent, PropType} from "vue";

export default defineComponent({
    name: "ViewCircuitItem",
    props: {
        circuit: {
            type: Object as PropType<Circuit>,
            required: true,
        },
    }
});
</script>