<template>
    <div>
        <!-- <b-radio v-model="formaPronosticar"

                 name="Seleccionar"
                 native-value="seleccionar">
            Seleccionar
        </b-radio>
        <b-radio v-model="formaPronosticar"

                 name="Arrastrar"
                 native-value="arrastrar">
            Arrastrar
        </b-radio>

        <div v-if="formaPronosticar === 'seleccionar'">
            Forma de selecccionar
        </div> -->
        <div class="columns">
            <div class="column is-6">
                <h3>Pilotos pronosticados</h3>
                <draggable class="list-group" :list="pilotosPronosticados" group="people">
                    <transition-group type="transition" :name="!drag ? 'flip-list' : null">
                        <li
                            class="list-group-item"
                            v-for="(element, index)  in pilotosPronosticados"
                            :key="element.id">
                            <i :class="element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'"
                               @click="element.fixed = !element.fixed"
                               aria-hidden="true"
                            ></i>
                            Pos {{ index + 1 }}. {{ element.name }}
                        </li>
                    </transition-group>
                </draggable>
            </div>
            <div class="column is-6">
                <h3>Lista de pilotos</h3>
                <draggable class="list-group" :list="pilotosDisponibles" group="people">
                    <transition-group type="transition" :name="!drag ? 'flip-list' : null">
                        <li
                            class="list-group-item"
                            v-for="element  in pilotosDisponibles"
                            :key="element.number">
                            <i :class="element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'"
                                @click="element.fixed = !element.fixed"
                                aria-hidden="true"
                            ></i>{{ element.firstname }} {{ element.lastname }} # {{ element.team.name }}
                        </li>
                    </transition-group>
                </draggable>
            </div>
        </div>

        Pronosticando para {{session}}
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {RaceSession} from "@/types/RaceSession";
import draggable from "vuedraggable";
import {driversService} from "@/_services";
import {GrandPrix} from "@/types/GrandPrix";
import {Driver} from "@/types/Driver";

@Component({
    components: {
        draggable
    }}
)
export default class SelectTipps extends Vue {
    @Prop({required: true}) session!: RaceSession;
    @Prop({required: true}) grandPrix!: GrandPrix;

    //private formaPronosticar = 'arrastrar';
    private drag: boolean = false;

    private pilotosPronosticados = [];
    private pilotosDisponibles: Array<Driver> = [];

    mounted() {
        driversService.getDriversInGrandPrix(this.grandPrix).then((drivers) => {
            this.pilotosDisponibles.push(...drivers);
        })
    }
}
</script>

<style scoped>
.button {
    margin-top: 35px;
}
.flip-list-move {
    transition: transform 0.5s;
}
.no-move {
    transition: transform 0s;
}
.ghost {
    opacity: 0.5;
    background: #c8ebfb;
}
.list-group {
    min-height: 20px;
}
.list-group-item {
    cursor: move;
}
.list-group-item i {
    cursor: pointer;
}
</style>