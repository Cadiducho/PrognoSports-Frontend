<template>
    <div class="content mt-5">
        <div class="columns is-3-mobile is-5-desktop">
            <div class="column is-6 box">
                <h3>Pilotos pronosticados</h3>
                <draggable class="block-list has-radius is-highlighted is-primary" :list="pilotosPronosticados" group="people" :emptyInsertThreshold="100">
                    <transition-group type="transition" :name="!drag ? 'flip-list' : null">
                        <li
                            class="has-radius is-primary"
                            v-for="(element, index)  in pilotosPronosticados"
                            :key="element.number">
                            <i :class="element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'"
                               @click="element.fixed = !element.fixed"
                               aria-hidden="true"
                            ></i>
                            Pos {{ index + 1 }}º. {{ element.firstname }} {{ element.lastname }} - {{ element.team.name }} ({{element.team.carname}})
                        </li>
                    </transition-group>
                </draggable>
            </div>
            <div class="column is-6 box">
                <h3>Lista de pilotos</h3>
                <b-field>
                    <b-input v-model="filtroPiloto" placeholder="Buscar piloto"></b-input>
                </b-field>
                <draggable class="block-list has-radius is-highlighted is-info" :list="pilotosDisponiblesFiltrados" group="people">
                    <transition-group type="transition" :name="!drag ? 'flip-list' : null">
                        <li
                            class="is-highlighted is-info"
                            v-for="element in pilotosDisponiblesFiltrados"
                            :key="element.number">
                            <i
                                :class="element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'"
                                @click="element.fixed = !element.fixed"
                                aria-hidden="true"
                            ></i>{{ element.firstname }} {{ element.lastname }} - {{ element.team.name }} ({{element.team.carname}})
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

    private drag: boolean = false;
    private filtroPiloto: string = '';

    private pilotosPronosticados: Array<Driver> = [];
    private pilotosDisponibles: Array<Driver> = [];

    get pilotosDisponiblesFiltrados(): Array<Driver> {
        if (!this.filtroPiloto.trim()) {
            return this.pilotosDisponibles;
        }

        return this.pilotosDisponibles.filter(driver => { return driver.lastname.toLowerCase().includes(this.filtroPiloto.toLowerCase())
                || driver.firstname.toLowerCase().includes(this.filtroPiloto.toLowerCase())
                || driver.team.name.toLowerCase().includes(this.filtroPiloto.toLowerCase())
                || driver.team.longname.toLowerCase().includes(this.filtroPiloto.toLowerCase())
                || driver.team.carname.toLowerCase().includes(this.filtroPiloto.toLowerCase())
        })
    }

    mounted() {
        driversService.getDriversInGrandPrix(this.grandPrix).then((drivers) => {
            this.pilotosDisponibles.push(...drivers);
        })
    }
}
</script>