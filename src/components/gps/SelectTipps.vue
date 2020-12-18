<template>
    <div class="content mt-5">
        <div class="columns is-mobile">
            <div class="column is-6">
                <h3>Lista de pilotos</h3>
                <b-field>
                    <b-input v-model="filtroPiloto" placeholder="Buscar piloto" type="search" icon-pack="fas" icon="search"></b-input>
                </b-field>
                <draggable class="block-list has-radius is-highlighted is-info" :list="pilotosDisponiblesFiltrados" group="people">
                    <transition-group type="transition" :name="!drag ? 'flip-list' : null">
                        <li
                            class="is-highlighted"
                            v-bind:style="styleDriverCard(element)"
                            v-for="element in pilotosDisponiblesFiltrados"
                            :key="element.number">
                            <i @click="element.fixed = !element.fixed"
                                aria-hidden="true"
                            ></i>{{ element.firstname }} {{ element.lastname }} #{{ element.number }} - {{ element.team.name }} ({{element.team.carname}})
                        </li>
                    </transition-group>
                </draggable>
            </div>
            <div class="column is-6">
                <h3>Pilotos pronosticados</h3>
                <draggable class="block-list has-radius is-highlighted is-primary" :list="pilotosPronosticados" group="people" :emptyInsertThreshold="100">
                    <transition-group type="transition" tag="div" :name="!drag ? 'flip-list' : null">
                        <li
                            class="has-radius is-primary"
                            v-for="(element, index)  in pilotosPronosticados"
                            :key="element.number">
                            <i @click="element.fixed = !element.fixed"
                               aria-hidden="true"
                            ></i>
                            <b>{{ index + 1 }}º.</b> {{ element.firstname }} {{ element.lastname }} #{{ element.number }}- {{ element.team.name }} ({{element.team.carname}})
                        </li>
                    </transition-group>
                </draggable>
                <b-button v-if="pilotosPronosticados.length > 0" type="is-danger is-light is-fullwidth" @click="reiniciarPronostico">Limpiar pronóstico</b-button>
            </div>
        </div>
        <b-button type="is-success is-fullwidth">Enviar pronóstico</b-button>
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
    private originalPilotos: Array<Driver> = [];

    public styleDriverCard(driver: Driver) {
        return {
            color: 'black',
            'border': '1px solid #'+ driver.team.teamcolor,
            'border-left': '10px #'+ driver.team.teamcolor + ' solid',
           // 'border-right': '30px #'+ driver.team.teamcolor + ' solid',
            'border-right-image-source': 'linear-gradient(to left, #'+ driver.team.teamcolor + ', #ffffff)',
            opacity: 0.9,
        }
    }

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

    private reiniciarPronostico() {
        this.pilotosPronosticados = [];
        this.pilotosDisponibles = [];
        this.pilotosDisponibles.push(...this.originalPilotos);
    }

    mounted() {
        driversService.getDriversInGrandPrix(this.grandPrix).then((drivers) => {
            this.originalPilotos.push(...drivers);
            this.pilotosDisponibles.push(...drivers);
        })
    }
}
</script>

<style scoped>
.block-list:empty,
.block-list > div:empty {
    padding:1rem;
    border: 1px solid #dbdbdb;
    border-radius: 4px;
}

.block-list:empty:before,
.block-list > div:empty:before {
    content: 'Coloca aquí tus pilotos en orden';
}
</style>