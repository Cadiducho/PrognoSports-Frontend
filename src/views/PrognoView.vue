<template>
    <div>
        <Navbar />

        <section class="section is-tiny">
            <div class="container prognocontainer">
                <nav class="breadcrumb" aria-label="breadcrumbs">
                    <ul>
                        <li><a href="#">PrognoSports</a></li>
                        <li class="is-active"><a href="#" aria-current="page">Inicio</a></li>
                    </ul>
                </nav>
                <div class="notification has-background-warning">Estás utilizando PrognoSports Beta, la experiencia puede verse afectada</div>

                <router-view :key="$route.fullPath"/>
            </div>
        </section>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import Navbar from "@/components/navbar/Navbar.vue";
import {namespace} from "vuex-class";
const Auth = namespace("Auth");

@Component({
    components: {
        Navbar,
    }
})
export default class PrognoView extends Vue {

}
</script>