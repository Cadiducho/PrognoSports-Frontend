<template>
    <div class="is-inline-block zoom ml-4 mr-4 mb-4">
        <a class="">
            <div class="card">
                <div class="card-image">
                    <figure class="image is-4by3">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Austin_circuit.svg/800px-Austin_circuit.svg.png"
                            alt="Placeholder image"
                        />
                    </figure>
                </div>
                <div class="card-content">
                    <div class="media">
                        <div class="media-left">
                            <figure class="image is-48x48">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/en/thumb/2/23/Circuit_of_the_Americas_logo.svg/1280px-Circuit_of_the_Americas_logo.svg.png"
                                    alt="Placeholder image"
                                />
                            </figure>
                        </div>
                        <div class="media-content">
                            <p class="title is-4">Circuit of the Americas</p>
                            <p class="subtitle is-6">
                                United States of America - Austin
                            </p>
                        </div>
                    </div>

                    <div class="content">
                        <div>
                            <i class="fas fa-map-marked-alt"></i>
                            <a class="ml-2" href="#">Ubicación</a>
                        </div>
                        <div>
                            <i class="fas fa-ruler"></i>
                            <span class="ml-2">Distancia: 5.412 Km</span>
                        </div>
                        <div>
                            <i class="fas fa-directions"></i>
                            <span class="ml-2">Curvas: 15</span>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component<ViewCircuitItem>({
    components: {},
})
export default class ViewCircuitItem extends Vue {}
</script>

<style>
.zoom {
    transition: transform 0.2s; /* Animation */
}

.zoom:hover {
    transform: scale(
        1.05
    ); /* (150% zoom - Note: if the zoom is too large, it will go outside of the viewport) */
}
</style>