<template>
    <div class="is-inline-block zoom ml-4 mr-4 mb-4">
        <a class="circuit">
            <div class="card circuit">
                <div class="card-image">
                    <figure class="image is-4by3">
                        <img
                            :src="circuit.variant.layout_image"
                            alt="Esquema"
                        />
                    </figure>
                </div>
                <div class="card-content">
                    <div class="media">
                        <div class="media-left">
                            <figure class="image is-48x48">
                                <img :src="circuit.logo_url" alt="No Logo" />
                            </figure>
                        </div>
                        <div class="media-content">
                            <p class="title is-4">{{circuit.name}} {{ hasVariant() ? (' - ' + circuit.variant.name) : ""}}</p>
                            <p class="subtitle is-6">
                                {{ circuit.locality }} - {{ circuit.country }}
                            </p>
                        </div>
                    </div>

                    <div class="content quick-data mb-5">
                        <div v-if="hasVariant()">
                            <i class="fas fa-fw fa-random"></i>
                            <span class="ml-1">
                                Variante: {{ circuit.variant.name }}
                            </span>
                        </div>
                        <div>
                            <i class="fas fa-fw fa-map-marked-alt"></i>
                            <a target="_blank"
                                class="ml-2"
                                :href="
                                    'https://www.openstreetmap.org/#map=16/' +
                                    circuit.latitude +
                                    '/' +
                                    circuit.longitude
                                "
                                >Ubicación</a
                            >
                        </div>
                        <div>
                            <i class="fas fa-fw fa-ruler"></i>
                            <span class="ml-2"
                                >Distancia:
                                {{ circuit.variant.distance }} km</span
                            >
                        </div>
                        <div>
                            <i class="fas fa-fw fa-directions"></i>
                            <span class="ml-2"
                                >Curvas: {{ circuit.variant.turns }}</span
                            >
                        </div>
                    </div>
                </div>
            </div>
        </a>
    </div>
</template>

<script lang="ts" scoped>
import { Circuit } from "@/types/Circuit";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component<ViewCircuitItem>({
    components: {},
})
export default class ViewCircuitItem extends Vue {
    @Prop() circuit!: Circuit;

    public hasVariant(): boolean {
        return this.circuit!.variant.name !== "grandprix";
    }
}
</script>

<style>

.circuit {
    width: 25em;
    height: 34em;
}

.quick-data {
    position: absolute;
    bottom: 0;
}

.zoom {
    transition: transform 0.2s;
}

.zoom:hover {
    transform: scale(
        1.05
    ); 
}
</style>