<template>
    <div class="content mt-5">
        <div class="columns is-mobile">
            <div class="column is-6">
                <h3>Lista de pilotos</h3>
                <b-collapse :open="false" aria-id="contentIdForA11y1" class="mb-2">
                    <template #trigger>
                        <b-button
                            label="Opciones de ordenado"
                            type="is-primary"
                            aria-controls="contentIdForA11y1" />
                    </template>

                    <div class="box">
                        <b-field label="Orderar lista de pilotos">
                            <b-radio v-model='orderType' :native-value='0'>Orden arfabético</b-radio>
                            <b-radio v-model='orderType' :native-value='1'>Por equipos</b-radio>
                            <b-radio v-model='orderType' :native-value='2'>Por dorsal</b-radio>
                            <b-radio v-model='orderType' :native-value='3' v-if="this.startGrid.length > 0">Por parrilla de salida</b-radio>
                        </b-field>
                        <b-field>
                            <b-switch v-model="orderAscendent">
                                Orden {{ orderAscendent ? "ascendente" : "descendente" }}
                            </b-switch>
                        </b-field>
                    </div>
                </b-collapse>

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
                <h3>Pilotos pronosticados ({{ cantidadPilotosPronosticados(currentCommunity, session) }})</h3>
                <draggable class="block-list has-radius is-highlighted is-primary"
                           :list="pilotosPronosticados" group="people"
                           :emptyInsertThreshold="1000">
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
                <template v-if="isBeforeEndDate(this.grandPrix, this.session)">
                    <b-button v-if="pilotosPronosticados.length === cantidadPilotosPronosticados(currentCommunity, session)"
                              type="is-success is-fullwidth"
                              @click="enviarPronostico">Enviar pronóstico
                    </b-button>
                </template>
                <b-button v-else disabled type="is-success is-fullwidth">
                    Ya no se puede pronosticar
                </b-button>


                <div v-else class="notification is-warning is-light">
                    El pronóstico debe tener {{ cantidadPilotosPronosticados(currentCommunity, session) }} pilotos escogidos y ordenados.
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
import {grandPrixService} from "@/_services";
import {GrandPrix} from "@/types/GrandPrix";
import {Driver} from "@/types/Driver";
import {Community} from "@/types/Community";
import {namespace} from "vuex-class";
import {RaceResult} from "@/types/RaceResult";
import {User} from "@/types/User";
import EventBus from "@/plugins/eventbus";
import {StartGridPosition} from "@/types/StartGridPosition";
const Auth = namespace('Auth')

@Component({
    components: {
        draggable
    }}
)
export default class SelectTipps extends Vue {
    @Prop({required: true}) session!: RaceSession;
    @Prop({required: true}) grandPrix!: GrandPrix;

    @Auth.State("user") private currentUser!: User;
    @Auth.State("community") private currentCommunity!: Community;

    private drag: boolean = false;
    private filtroPiloto: string = '';
    private orderType: number = 1;
    private orderAscendent: boolean = false;

    private pilotosPronosticados: Array<Driver> = [];
    private pilotosDisponibles: Array<Driver> = [];
    private originalPilotos: Array<Driver> = [];

    private startGrid: Array<StartGridPosition> = [];
    private indexedGrid: Map<number, number> = new Map(); // Dorsal del piloto -> Posicion en la grid

    mounted() {

        EventBus.$on('sendDriversInGrandPrix', (drivers: Array<Driver>) => {
            this.originalPilotos.push(...drivers);
            this.pilotosDisponibles.push(...drivers);
        });

        EventBus.$on('sendStartGrid', (grid: Array<StartGridPosition>) => {
            grid.forEach(gpos => {
                this.startGrid.push(gpos);
                this.indexedGrid.set(gpos.driver.number, gpos.position);
            })
        });

        grandPrixService.getUserTipps(this.grandPrix, this.session, this.currentCommunity, this.currentUser).then((userTipps) => {
            for (let key in userTipps) {
                let value: RaceResult = userTipps[key]!;

                // Básicamente, si hay pronóstico. De otro modo, driver es undefined (value es {})
                if (value.driver != undefined) {
                    // Elimino al piloto pronosticado de la lsita de disponibles
                    this.pilotosDisponibles = this.pilotosDisponibles.filter(d => d.code != value.driver.code);

                    // Añado el piloto pronosticado a la lista de pronósticos
                    this.pilotosPronosticados.push(value.driver);
                }
            }
        });
    }

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
        let sortAlfabetico = (d1: Driver, d2: Driver) => (d1.lastname < d2.lastname ? -1 : 1);
        let sortEquipos = (d1: Driver, d2: Driver) => (d1.team.name < d2.team.name ? -1 : 1);
        let sortDorsal = (d1: Driver, d2: Driver) => (d1.number < d2.number ? -1 : 1);
        let sortParrilla = (d1: Driver, d2: Driver) => (this.indexedGrid.get(d1.number)! < this.indexedGrid.get(d2.number)! ? -1 : 1);


        let pickedSort: (d1: Driver, d2: Driver) => (number);
        switch (this.orderType) {
            case 1: pickedSort = sortEquipos; break;
            case 2: pickedSort = sortDorsal; break;
            case 3: pickedSort = sortParrilla; break;
            default: pickedSort = sortAlfabetico;
        }
        let listaOrdenada = this.pilotosDisponibles.sort(pickedSort);

        if (this.orderAscendent) {
            listaOrdenada = listaOrdenada.reverse();
        }
        if (!this.filtroPiloto.trim()) {
            return listaOrdenada;
        }

        let filtroLowerCase = this.filtroPiloto.toLowerCase();
        return listaOrdenada.filter(driver => {
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
        let tipps: Array<RaceResult> = [];

        this.pilotosPronosticados.forEach((driver, index, array) => {
            tipps.push({position: index + 1, driver: {id: driver.id} as Driver} as RaceResult);
        });
        grandPrixService.postUserTipps(this.grandPrix, this.session, this.currentCommunity, tipps).then(
            () => {
                this.$buefy.toast.open({
                    message: "¡Has guardado tus pronósticos!",
                    type: "is-success",
                });
            },
            (error: any) => {
                let message = "Error guardando tus pronósticos: " + error.message;

                this.$buefy.toast.open({
                    duration: 5000,
                    message: message,
                    type: "is-danger",
                });
            });
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