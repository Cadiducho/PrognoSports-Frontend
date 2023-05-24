<template>
    <div class="card">
        <div class="card-image">
            <figure class="image">
                <img v-if="circuit.hasLogoImage" :src="circuit.logoImage()" alt="Logo image">
            </figure>
            <figure class="image">
                <img :src="variant.layoutImage(true)" alt="Circuit layout image">
            </figure>
        </div>
        <div class="card-content">
            <div class="media">
                <div class="media-content">
                    <p class="title is-4">
                        <router-link :to="circuit.circuitLink()" class="has-text-black">
                            {{ circuit.name }} {{ variant.isDefault() ? "" : ('- ' + variant.name) }}
                        </router-link>
                    </p>
                    <p class="subtitle is-6">{{ circuit.locality }}, {{ circuit.country }}</p>
                </div>
            </div>

            <div class="content">
                <p v-if="!variant.isDefault()" class="card-text"><b>Variante: </b>{{ variant.name }}</p>
                <p class="card-text"><b>Distancia por vuelta: </b>{{ variant.distance }}km</p>
                <p v-if="hasLaps()" class="card-text"><b>Vueltas: </b>{{ laps }}</p>
                <p v-if="hasLaps()" class="card-text"><b>Distancia total: </b>{{ (laps * variant.distance).toFixed(2) }}km</p>
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