<template>
    <div class="content mt-5">

        <PrognoAlert message="Arrastra las tarjetas para completar tu pronóstico." />

        <div class="flex space-x-4 mb-4">

            <div class="flex-1">
                <h3 class="select-none dark:text-gray-300">Pilotos disponibles</h3>

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
                            <o-radio v-model='orderType' :native-value='3' v-if="indexedGrid.size > 0">
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

                <draggable
                    :id="`pronosticados-${session.id}`"
                    class="w-full h-full select-none space-y-2"
                    :list="pilotosDisponiblesFiltrados"
                    group="people"
                    itemKey="name"
                >
                    <template #item="{ element, index }">
                        <DraggableDriverCard
                            v-if="aplicaFiltrito(element)"
                            :driver="element" :index="index" :showPosition="false" />
                    </template>
                </draggable>
            </div>

            <div class="flex-1">
                <h3 class="select-none dark:text-gray-300">Tu pronóstico</h3>
                <draggable
                    :id="`pronosticados-${session.id}`"
                    class="w-full h-full select-none space-y-2"
                    :list="pilotosPronosticados"
                    group="people"
                    itemKey="name"
                >
                    <template #item="{ element, index }">
                        <DraggableDriverCard :driver="element" :index="index" showPosition />
                    </template>
                </draggable>
            </div>

        </div>

        <template v-if="session.isBeforeClosureDate()">
            <o-button v-if="pilotosPronosticados.length === ruleSet.cantidadPilotosPronosticados(session)"
                      variant="success is-fullwidth"
                      :disabled="sendingPronostico"
                      @click="enviarPronostico">Enviar pronóstico
            </o-button>

            <div v-else class="notification is-warning is-light">
                El pronóstico debe tener {{ ruleSet.cantidadPilotosPronosticados(session) }} pilotos escogidos y ordenados (Has escogido {{ pilotosPronosticados.length}} ).
            </div>
        </template>

        <button v-else disabled class="button is-success is-fullwidth">
            Ya no se puede pronosticar
        </button>

        <hr v-if="(pilotosPronosticados.length > 0) && session.isBeforeClosureDate()"/>
        <o-button v-if="(pilotosPronosticados.length > 0) && session.isBeforeClosureDate()" variant="danger is-light is-fullwidth" @click="reiniciarPronostico">Limpiar pronóstico</o-button>

    </div>
</template>

<script lang="ts">
import {RaceSession} from "@/types/RaceSession";
import {grandPrixService, notificationService} from "@/_services";
import {GrandPrix} from "@/types/GrandPrix";
import {Driver} from "@/types/Driver";
import {RaceResult} from "@/types/RaceResult";
import {StartGridPosition} from "@/types/StartGridPosition";
import {RuleSet} from "@/types/RuleSet";

import {defineComponent, PropType, ref} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import {useStyles} from "@/composables/useStyles";

import draggable from 'vuedraggable'
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import DraggableDriverCard from "@/components/gps/DraggableDriverCard.vue";

export default defineComponent({
    name: "SelectTipps",
    components: {
        DraggableDriverCard,
        PrognoAlert,
        draggable
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
            sendingPronostico: false,

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
            if (session.id === this.session.id) {
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
        reiniciarPronostico() {
            this.pilotosPronosticados = [];
            this.pilotosDisponibles = [];
            this.pilotosDisponibles.push(...this.originalPilotos);
        },
        async enviarPronostico() {
            this.sendingPronostico = true;
            let tipps: Array<RaceResult> = [];

            this.pilotosPronosticados.forEach((driver: Driver, index: number, array: Driver[]) => {
                tipps.push({position: index + 1, driver: {id: driver.id} as Driver} as RaceResult);
            });

            try {
                await grandPrixService.postUserTipps(this.grandPrix, this.session, this.currentCommunity, tipps);
                notificationService.showNotification("¡Has guardado tus pronósticos!");
            } catch (error: any) {
                let message = "Error guardando tus pronósticos: " + error.message;

                notificationService.showNotification(message, "error");
            } finally {
                setTimeout(() => {
                    this.sendingPronostico = false;
                }, 1000);
            }
        },
        aplicaFiltrito(driver: Driver) {
            let filtroLowerCase = this.filtroPiloto.toLowerCase();
            return driver.lastname.toLowerCase().includes(filtroLowerCase)
                || driver.firstname.toLowerCase().includes(filtroLowerCase)
                || driver.team.name.toLowerCase().includes(filtroLowerCase)
                || driver.team.longname.toLowerCase().includes(filtroLowerCase)
                || driver.team.carname.toLowerCase().includes(filtroLowerCase);
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

                return listaOrdenada
            },
            set(value: Array<Driver>) {
            }
        }
    }
});
</script>