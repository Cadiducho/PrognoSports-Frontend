<template>
    <div class="content mt-5">
        <div class="columns is-mobile">
            <div class="column is-6">
                <h3>Lista de pilotos</h3>
                <o-collapse :open="false" aria-id="opcionesOrdenado" class="mb-2">
                    <template #trigger>
                        <o-button
                            label="Opciones de ordenado"
                            variant="primary"
                            aria-controls="opcionesOrdenado" />
                    </template>

                    <div class="box">
                        <o-field label="Orderar lista de pilotos">
                            <o-radio v-model='orderType' :native-value='0'>Orden alfabético</o-radio>
                            <o-radio v-model='orderType' :native-value='1'>Por equipos</o-radio>
                            <o-radio v-model='orderType' :native-value='2'>Por dorsal</o-radio>
                            <o-radio v-model='orderType' :native-value='3' v-if="this.indexedGrid.size > 0">Por parrilla de salida</o-radio>
                        </o-field>
                        <o-field>
                            <o-switch v-model="orderAscendent">
                                Orden {{ orderAscendent ? "ascendente" : "descendente" }}
                            </o-switch>
                        </o-field>
                    </div>
                </o-collapse>

                <o-field>
                    <o-input v-model="filtroPiloto" placeholder="Buscar piloto" type="search" icon-pack="fas" icon="search"></o-input>
                </o-field>
                <draggable class="block-list has-radius is-highlighted is-info"
                <draggable class="block-list has-radius is-highlighted is-info no-select"
                           :list="pilotosDisponiblesFiltrados" :group="session.name">
                    <transition-group type="transition" :name="!drag ? 'flip-list' : null">
                        <li
                            class="is-highlighted has-text-weight-semibold is-flex is-justify-content-space-between"
                            :style="styleDriverCard(element)"
                            v-for="(element, index) in pilotosDisponiblesFiltrados"
                            :key="element.number">

                            <span>
                                {{ element.firstname }} {{ element.lastname }}
                                <span class="tag is-rounded" v-bind:style="styleDorsal(element)">#{{ element.number }}</span>
                                <o-tooltip class="ml-1" :label="element.team.longname">
                                    {{ element.team.name }}
                                </o-tooltip>
                                ({{element.team.carname}})
                            </span>

                            <a @click="moveToTippList(element, index)" class="pl-3 pr-3">
                                <i class="mr-0 fas fa-angle-right has-text-primary"></i>
                                <i class="ml-0 fas fa-angle-right has-text-primary"></i>
                            </a>
                        </li>
                    </transition-group>
                </draggable>
            </div>
            <div class="column is-6">
                <h3>Pilotos pronosticados ({{ cantidadPilotosPronosticados(ruleSet, session) }})</h3>
                <draggable class="block-list has-radius is-highlighted is-primary no-select"
                           :list="pilotosPronosticados" :group="session.name"
                           :emptyInsertThreshold="1000">
                    <transition-group type="transition" tag="div" :name="!drag ? 'flip-list' : null">
                        <li
                            class="is-highlighted has-text-weight-semibold is-flex is-justify-content-left"
                            v-bind:style="styleDriverCard(element)"
                            v-for="(element, index)  in pilotosPronosticados"
                            :key="element.number">

                            <a @click="moveToAvailableList(element, index)" class="mr-3 pl-3">
                                <i class="mr-0 fas fa-angle-left has-text-primary"></i>
                                <i class="ml-0 fas fa-angle-left has-text-primary"></i>
                            </a>

                            <span>
                                <b>{{ index + 1 }}º.</b> {{ element.firstname }} {{ element.lastname }}
                                <span class="tag is-rounded" v-bind:style="styleDorsal(element)">#{{ element.number }}</span>
                                <o-tooltip class="ml-1" :label="element.team.longname">
                                    {{ element.team.name }}
                                </o-tooltip>
                                ({{element.team.carname}})
                            </span>
                        </li>
                    </transition-group>
                </draggable>
                <template v-if="isBeforeEndDate(this.session)">
                    <o-button v-if="pilotosPronosticados.length === cantidadPilotosPronosticados(ruleSet, session)"
                              variant="success is-fullwidth"
                              @click="enviarPronostico">Enviar pronóstico
                    </o-button>
                </template>
                <o-button v-else disabled variant="success is-fullwidth">
                    Ya no se puede pronosticar
                </o-button>


                <div v-else class="notification is-warning is-light">
                    El pronóstico debe tener {{ cantidadPilotosPronosticados(ruleSet, session) }} pilotos escogidos y ordenados.
                </div>

                <hr v-if="(pilotosPronosticados.length > 0) && isBeforeEndDate(this.session)"/>
                <o-button v-if="(pilotosPronosticados.length > 0) && isBeforeEndDate(this.session)" variant="danger is-light is-fullwidth" @click="reiniciarPronostico">Limpiar pronóstico</o-button>

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
import {StartGridPosition} from "@/types/StartGridPosition";
import {RuleSet} from "@/types/RuleSet";
const Auth = namespace('Auth')

@Component({
    components: {
        draggable
    }}
)
export default class SelectTipps extends Vue {
    @Prop({required: true}) session!: RaceSession;
    @Prop({required: true}) grandPrix!: GrandPrix;
    @Prop({required: true}) ruleSet!: RuleSet;
    @Prop({required: true}) drivers!: Array<Driver>;
    @Prop({required: true}) startGrids!: Map<RaceSession, Array<StartGridPosition>>;

    @Auth.State("user") private currentUser!: User;
    @Auth.State("community") private currentCommunity!: Community;

    private drag: boolean = false;
    private filtroPiloto: string = '';
    private orderType: number = 1;
    private orderAscendent: boolean = false;

    private pilotosPronosticados: Array<Driver> = [];
    private pilotosDisponibles: Array<Driver> = [];
    private originalPilotos: Array<Driver> = [];

    private indexedGrid: Map<number, number> = new Map(); // Dorsal del piloto -> Posicion en la grid

    mounted() {

        this.originalPilotos.push(...this.drivers);
        this.pilotosDisponibles.push(...this.drivers);

        for (let [session, grid] of this.startGrids) {
            if (session.name === this.session.name) {
                grid.forEach(gpos => {
                    this.indexedGrid.set(gpos.driver.number, gpos.position);
                })
            }
        }

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

    public moveToTippList(driver: Driver, index: number) {
        console.log("Moviendo a pronosticados " + driver.code);
        this.pilotosDisponibles.splice(index, 1);
        this.pilotosPronosticados.push(driver);
    }

    public moveToAvailableList(driver: Driver, index: number) {
        console.log("Moviendo a disponibles " + driver.code);
        this.pilotosPronosticados.splice(index, 1);
        this.pilotosDisponibles.push(driver);
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
        const sortAlfabetico = (d1: Driver, d2: Driver) => (d1.lastname < d2.lastname ? -1 : 1);
        const sortEquipos = (d1: Driver, d2: Driver) => (d1.team.name < d2.team.name ? -1 : 1);
        const sortDorsal = (d1: Driver, d2: Driver) => (d1.number < d2.number ? -1 : 1);
        const sortParrilla = (d1: Driver, d2: Driver) => (this.indexedGrid.get(d1.number)! < this.indexedGrid.get(d2.number)! ? -1 : 1);


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
                this.$oruga.notification.open({
                    message: "¡Has guardado tus pronósticos!",
                    variant: "success",
                });
            },
            (error: any) => {
                let message = "Error guardando tus pronósticos: " + error.message;

                this.$oruga.notification.open({
                    duration: 5000,
                    message: message,
                    variant: "danger",
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
.block-list li {
    padding: 0.75rem;
}

.block-list:empty:before,
.block-list > div:empty:before {
    content: 'Coloca aquí tus pilotos en orden';
}
.no-select {
    user-select: none;
}
</style>