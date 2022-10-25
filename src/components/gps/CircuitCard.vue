<template>
    <div class="card">
        <div class="card-image">
            <figure class="image">
                <img v-if="circuit.hasLogoImage" :src="circuit.logoImage()" alt="Logo image">
            </figure>
            <figure class="image">
                <img :src="circuit.variant.layoutImage()" alt="Circuit layout image">
            </figure>
        </div>
        <div class="card-content">
            <div class="media">
                <div class="media-content">
                    <p class="title is-4">
                        <router-link :to="'/circuits/' + circuit.id + (hasVariant(circuit) ? ('/' + circuit.variant.name) : '')" class="has-text-black">
                            {{circuit.name}} {{ hasVariant(circuit) ? ('- ' + circuit.variant.name) : ""}}
                        </router-link>
                    </p>
                    <p class="subtitle is-6">{{circuit.locality}}, {{circuit.country}}</p>
                </div>
            </div>

            <div class="content">
                <p v-if="hasVariant(circuit)" class="card-text"><b>Variante: </b>{{ circuit.variant.name }}</p>
                <p class="card-text"><b>Distancia por vuelta: </b>{{ circuit.variant.distance }}km</p>
                <p v-if="hasLaps()" class="card-text"><b>Vueltas: </b>{{ laps }}</p>
                <p v-if="hasLaps()" class="card-text"><b>Distancia total: </b>{{ (laps * circuit.variant.distance).toFixed(2) }}km</p>
            </div>
            <o-button variant="info is-light is-fullwidth" tag="router-link" :to="circuitUrl">Más datos del circuito</o-button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Circuit} from "@/types/Circuit";
    import {hasVariant} from "@/utils";

    import {defineComponent, PropType} from "vue";
    import {useAuthStore} from "@/store/authStore";
    import {useCommunityStore} from "@/store/communityStore";

    export default defineComponent({
        name: "CircuitCard",
        props: {
            circuit: {
                type: Object as PropType<Circuit>,
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
            const currentCommunity = communityStore.community;
            return { currentUser, currentCommunity };
        },
        methods: {
            hasLaps(): boolean {
                return this.laps != undefined || this.laps != 0;
            }
        },
        computed: {
            circuitUrl(): string {
                let variant = hasVariant(this.circuit) ? ('/ '+ this.circuit!.variant) : "";
                return '/circuits/' + this.circuit!.id + variant;
            }
        }
    });
</script>