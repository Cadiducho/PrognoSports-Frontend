<template>
    <div class="content mt-5">
        <div class="columns is-mobile">
            <div class="column is-6">
                <h3 class="is-unselectable">Lista de pilotos</h3>

                <div class="busqueda-ordenada">
                    <o-button label="Ordenar" variant="primary" aria-controls="opcionesOrdenado" @click="opcionesOrdenadoOpen = !opcionesOrdenadoOpen"/>

                    <o-field class="is-fullwidth">
                        <o-input v-model="filtroPiloto" placeholder="Buscar..." type="search" icon-pack="fas" icon="search"></o-input>
                    </o-field>
                </div>

                <o-collapse :open="opcionesOrdenadoOpen" aria-id="opcionesOrdenado" class="box-ordenado">
                    <template #trigger>
                    </template>

                    <div class="box mt-1">
                        <label class="label">Orderar lista de pilotos</label>
                        <div class="field mb-0">
                            <o-radio v-model='orderType' :native-value='0'>
                                Por nombre
                            </o-radio>
                        </div>
                        <div class="field mb-0">
                            <o-radio v-model='orderType' :native-value='1'>
                                Por equipos
                            </o-radio>
                        </div>
                        <div class="field mb-0">
                            <o-radio v-model='orderType' :native-value='2'>
                                Por dorsal
                            </o-radio>
                        </div>
                        <div class="field mb-1">
                            <o-radio v-model='orderType' :native-value='3' v-if="this.indexedGrid.size > 0">
                                Por parrilla
                            </o-radio>
                        </div>
                        <div class="field">
                            <o-switch v-model="orderAscendent">
                                Invertir
                            </o-switch>
                        </div>
                    </div>
                </o-collapse>

                <SlickList v-model:list="pilotosDisponiblesFiltrados" :group="session.name" :accept="[session.name]" tag="ul" @sort-insert="insertToDisponibles($event)"
                           class="block-list has-radius is-unselectable">

                    <SlickDriverCard v-for="(item, index) in pilotosDisponiblesFiltrados" :key="item.id" :index="index" :driver="item" :showPosition="false"/>
                </SlickList>

            </div>

            <div class="column is-6">
                <h3 class="is-unselectable">Pilotos pronosticados</h3>
                <SlickList v-model:list="pilotosPronosticados" :group="session.name" :accept="[session.name]" tag="ul" @sort-insert="insertToPronosticados($event)"
                           class="block-list is-unselectable pilotos-pronosticados">

                    <SlickDriverCard v-for="(item, index) in pilotosPronosticados" :key="item.id" :index="index" :driver="item" :showPosition="true" />
                </SlickList>
            </div>
        </div>

        <template v-if="this.session.isBeforeClosureDate()">
            <o-button v-if="pilotosPronosticados.length === cantidadPilotosPronosticados(ruleSet, session)"
                      variant="success is-fullwidth"
                      @click="enviarPronostico">Enviar pronóstico
            </o-button>

            <div v-else class="notification is-warning is-light">
                El pronóstico debe tener {{ cantidadPilotosPronosticados(ruleSet, session) }} pilotos escogidos y ordenados.
            </div>
        </template>

        <button v-else disabled class="button is-success is-fullwidth">
            Ya no se puede pronosticar
        </button>

        <hr v-if="(pilotosPronosticados.length > 0) && this.session.isBeforeClosureDate()"/>
        <o-button v-if="(pilotosPronosticados.length > 0) && this.session.isBeforeClosureDate()" variant="danger is-light is-fullwidth" @click="reiniciarPronostico">Limpiar pronóstico</o-button>

    </div>
</template>

<script lang="ts">
import {RaceSession} from "@/types/RaceSession";
import { SlickList, SlickItem } from 'vue-slicksort';
import {grandPrixService, notificationService} from "@/_services";
import {GrandPrix} from "@/types/GrandPrix";
import {Driver} from "@/types/Driver";
import {RaceResult} from "@/types/RaceResult";
import {StartGridPosition} from "@/types/StartGridPosition";
import {RuleSet} from "@/types/RuleSet";

import {defineComponent, PropType} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import {useStyles} from "@/composables/useStyles";
import SlickDriverCard from "@/components/gps/SlickDriverCard.vue";

export default defineComponent({
    name: "SelectTipps",
    components: {
        SlickList,
        SlickItem,
        SlickDriverCard
    },
    props: {
        session: {
            type: Object as PropType<RaceSession>,
            required: true,
        },
        grandPrix: {
            type: Object as PropType<GrandPrix>,
            required: true,
        },
        ruleSet: {
            type: Object as PropType<RuleSet>,
            required: true,
        },
        drivers: {
            type: Array as PropType<Array<Driver>>,
            required: true,
        },
        startGrids: {
            type: Map as PropType<Map<RaceSession, Array<StartGridPosition>>>,
            required: true,
        },
    },
    setup() {
        const authStore = useAuthStore();
        const communityStore = useCommunityStore();
        const styles = useStyles();

        const currentUser = authStore.loggedUser;
        const currentCommunity = communityStore.currentCommunity;
        const styleDriverCard = styles.styleDriverCard;
        const styleDorsal = styles.styleDorsal;

        return { currentUser, currentCommunity, styleDriverCard, styleDorsal };
    },
    data() {
        return {
            drag: false,
            filtroPiloto: '',
            opcionesOrdenadoOpen: false,
            orderType: 1,
            orderAscendent: false,

            pilotosPronosticados: new Array<Driver>(),
            pilotosDisponibles: new Array<Driver>(),
            originalPilotos: new Array<Driver>(),
            indexedGrid: new Map<number, number>(), // Dorsal del piloto -> Posicion en la grid
        }
    },
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
    },
    methods: {
        /*
        moveToTippList(driver: Driver, index: number) {
            console.log("Moviendo a pronosticados " + driver.code);
            this.pilotosDisponibles.splice(index, 1);
            this.pilotosPronosticados.push(driver);
        },
        moveToAvailableList(driver: Driver, index: number) {
            console.log("Moviendo a disponibles " + driver.code);
            this.pilotosPronosticados.splice(index, 1);
            this.pilotosDisponibles.push(driver);
        },*/
        reiniciarPronostico() {
            this.pilotosPronosticados = [];
            this.pilotosDisponibles = [];
            this.pilotosDisponibles.push(...this.originalPilotos);
        },
        enviarPronostico() {
            let tipps: Array<RaceResult> = [];

            this.pilotosPronosticados.forEach((driver, index, array) => {
                tipps.push({position: index + 1, driver: {id: driver.id} as Driver} as RaceResult);
            });
            grandPrixService.postUserTipps(this.grandPrix, this.session, this.currentCommunity, tipps).then(
                () => {
                    notificationService.showNotification("¡Has guardado tus pronósticos!");
                },
                (error: any) => {
                    let message = "Error guardando tus pronósticos: " + error.message;

                    notificationService.showNotification(message, "danger");
                });
        },
        insertToPronosticados(event: { newIndex: number, value: any }) {
            const { newIndex, value } = event;

            this.pilotosDisponibles.splice(this.pilotosDisponibles.findIndex(d => d.id === value.id), 1);
        },
        insertToDisponibles(event: { newIndex: number, value: any }) {
            const { value } = event;

            this.pilotosDisponibles.push(value);
        }
    },
    computed: {
        pilotosDisponiblesFiltrados: {
            get(): Array<Driver> {
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
            },
            set(value: Array<Driver>) {
            }
        }
    }
});
</script>

<style scoped lang="scss">
@import "bulma/sass/utilities/_all.sass";

.block-list:empty:before,
.block-list > div:empty:before {
    content: 'Coloca aquí tus pilotos en orden';
}

.box-ordenado {
    margin-bottom: 0.5rem !important;
}

.driver-card {
    display: flex;
    cursor: move !important;

    .driver-card-team {
        font-weight: lighter;
    }
}

.pilotos-pronosticados {
    height: calc(100% - 10rem);
}


// Resolución móvil
@media screen and (max-width: $desktop) {
    .box-ordenado {
        font-size: 0.9rem;
    }/*
    .arrow-col {
        display: none;
    }*/
    .driver-card {
        a, span {
            font-size: 0.8rem;
        }
        .tag {
            display: none;
        }
    }
}
</style>