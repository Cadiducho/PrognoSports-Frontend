<template>
    <div class="card bg-white dark:bg-gray-900 rounded shadow-md rounded-lg relative max-w-full">
        <div class="block relative">
            <figure class="block relative">
                <img v-if="circuit.hasLogoImage" :src="circuit.logoImage()" alt="Logo image">
            </figure>
            <figure class="block relative">
                <img :src="variant.layoutImage(true)" alt="Circuit layout image">
            </figure>
        </div>
        <div class="p-5 bg-transparent">
            <div class="flex items-start">
                <div class="basis-auto grow shrink">
                    <p class="font-semibold text-xl">
                        <router-link :to="circuit.circuitLink()" class="text-black dark:text-gray-200">
                            {{ circuit.name }} {{ variant.isDefault() ? "" : ('- ' + variant.name) }}
                        </router-link>
                    </p>
                    <p class="font-normal text-base mb-3 dark:text-gray-300">{{ circuit.locality }}, {{ circuit.country }}</p>
                </div>
            </div>

            <div class="dark:text-gray-300 mb-3">
                <p v-if="!variant.isDefault()"><b>Variante: </b>{{ variant.name }}</p>
                <p class="mt-2"><b>Distancia por vuelta: </b>{{ variant.distance }}km</p>
                <p v-if="hasLaps()" class="mt-2"><b>Vueltas: </b>{{ laps }}</p>
                <p v-if="hasLaps()" class="mt-2"><b>Distancia total: </b>{{ (laps * variant.distance).toFixed(2) }}km</p>
            </div>
            <o-button variant="info is-light is-fullwidth" tag="router-link" :to="circuit.circuitLink()">Más datos del circuito</o-button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Circuit} from "@/types/Circuit";
    import {hasVariant} from "@/utils";

    import {defineComponent, PropType} from "vue";
    import {useAuthStore} from "@/store/authStore";
    import {useCommunityStore} from "@/store/communityStore";
    import {CircuitVariant} from "@/types/CircuitVariant";

    export default defineComponent({
        name: "CircuitCard",
        props: {
            circuit: {
                type: Object as PropType<Circuit>,
                required: true
            },
            variant: {
                type: Object as PropType<CircuitVariant>,
                required: true
            },
            laps: {
                type: Number
            }
        },
        setup() {
            const authStore = useAuthStore();
            const communityStore = useCommunityStore();

            const currentUser = authStore.loggedUser;
            const currentCommunity = communityStore.currentCommunity;
            return { currentUser, currentCommunity };
        },
        methods: {
            hasLaps(): boolean {
                return this.laps != undefined || this.laps != 0;
            }
        },
    });
</script>