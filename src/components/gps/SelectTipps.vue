<template>
    <div class="content mt-5">
        <div class="columns is-mobile">
            <div class="column is-6">
                <h3>Lista de pilotos</h3>
                <b-field>
                    <b-input v-model="filtroPiloto" placeholder="Buscar piloto" type="search" icon-pack="fas" icon="search"></b-input>
                </b-field>
                <draggable class="block-list has-radius is-highlighted is-info"
                           :list="pilotosDisponiblesFiltrados" group="people">
                    <transition-group type="transition" :name="!drag ? 'flip-list' : null">
                        <li
                            class="is-highlighted has-text-weight-semibold"
                            v-bind:style="styleDriverCard(element)"
                            v-for="element in pilotosDisponiblesFiltrados"
                            :key="element.number">
                            <i @click="element.fixed = !element.fixed"
                                aria-hidden="true"
                            ></i>
                                {{ element.firstname }} {{ element.lastname }}
                                <span class="tag is-rounded" v-bind:style="styleDorsal(element)">#{{ element.number }}</span>
                                <b-tooltip class="ml-1" :label="element.team.longname">
                                    {{ element.team.name }}
                                </b-tooltip>
                                ({{element.team.carname}})
                        </li>
                    </transition-group>
                </draggable>
            </div>
            <div class="column is-6">
                <h3>Pilotos pronosticados ({{cantidadPilotosPronosticados}})</h3>
                <draggable class="block-list has-radius is-highlighted is-primary"
                           :list="pilotosPronosticados" group="people"
                           :emptyInsertThreshold="100">
                    <transition-group type="transition" tag="div" :name="!drag ? 'flip-list' : null">
                        <li
                            class="is-highlighted has-text-weight-semibold"
                            v-bind:style="styleDriverCard(element)"
                            v-for="(element, index)  in pilotosPronosticados"
                            :key="element.number">
                            <i @click="element.fixed = !element.fixed"
                               aria-hidden="true"
                            ></i>
                                <b>{{ index + 1 }}º.</b> {{ element.firstname }} {{ element.lastname }}
                                <span class="tag is-rounded" v-bind:style="styleDorsal(element)">#{{ element.number }}</span>
                                <b-tooltip class="ml-1" :label="element.team.longname">
                                    {{ element.team.name }}
                                </b-tooltip>
                                ({{element.team.carname}})
                        </li>
                    </transition-group>
                </draggable>
                <b-button v-if="pilotosPronosticados.length === cantidadPilotosPronosticados" type="is-success is-fullwidth" @click="enviarPronostico">Enviar pronóstico</b-button>
                <div v-else class="notification is-warning is-light">
                    El pronóstico debe tener {{ cantidadPilotosPronosticados }} pilotos escogidos y ordenados.
                </div>

                <hr v-if="pilotosPronosticados.length > 0"/>
                <b-button v-if="pilotosPronosticados.length > 0" type="is-danger is-light is-fullwidth" @click="reiniciarPronostico">Limpiar pronóstico</b-button>

            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {RaceSession} from "@/types/RaceSession";
import draggable from "vuedraggable";
import {driversService} from "@/_services";
import {GrandPrix} from "@/types/GrandPrix";
import {Driver} from "@/types/Driver";
import {Community} from "@/types/Community";
import {namespace} from "vuex-class";
const Auth = namespace('Auth')

@Component({
    components: {
        draggable
    }}
)
export default class SelectTipps extends Vue {
    @Prop({required: true}) session!: RaceSession;
    @Prop({required: true}) grandPrix!: GrandPrix;

    @Auth.State("community") private currentCommunity!: Community;

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

    public styleDorsal(driver: Driver) {
        return {
            color: 'white',
            textShadow: '0 0 2px #000',
            backgroundColor: '#' + driver.team.teamcolor,
    }
    }

    get pilotosDisponiblesFiltrados(): Array<Driver> {
        if (!this.filtroPiloto.trim()) {
            return this.pilotosDisponibles;
        }

        let filtroLowerCase = this.filtroPiloto.toLowerCase();
        return this.pilotosDisponibles.filter(driver => {
            return driver.lastname.toLowerCase().includes(filtroLowerCase)
                || driver.firstname.toLowerCase().includes(filtroLowerCase)
                || driver.team.name.toLowerCase().includes(filtroLowerCase)
                || driver.team.longname.toLowerCase().includes(filtroLowerCase)
                || driver.team.carname.toLowerCase().includes(filtroLowerCase);
        })
    }

    private reiniciarPronostico() {
        this.pilotosPronosticados = [];
        this.pilotosDisponibles = [];
        this.pilotosDisponibles.push(...this.originalPilotos);
    }

    private enviarPronostico() {
    }

    get cantidadPilotosPronosticados() {
        switch (this.session) {
            case RaceSession.QUALIFY:
                return this.currentCommunity.qualify_positions_predicted;
            case RaceSession.RACE:
                return this.currentCommunity.race_positions_predicted;
        }
        return 0;
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