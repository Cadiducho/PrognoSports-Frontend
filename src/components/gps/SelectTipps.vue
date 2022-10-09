<template>
    <div class="content mt-5">
        <div class="columns listas">
            <div class="column is-6">
                <h3>Lista de pilotos</h3>

                <div class="is-flex">
                    <o-button label="Ordenar" variant="primary" aria-controls="opcionesOrdenado" @click="opcionesOrdenadoOpen = !opcionesOrdenadoOpen"/>

                    <o-field class="ml-1 is-fullwidth">
                        <o-input v-model="filtroPiloto" placeholder="Buscar piloto" type="search" icon-pack="fas"
                                 icon="search"></o-input>
                    </o-field>
                </div>

                <o-collapse :open="opcionesOrdenadoOpen" aria-id="opcionesOrdenado" class="mb-2">
                    <template #trigger>
                    </template>

                    <div class="box mt-1">
                        <label class="label">Orderar lista de pilotos</label>
                        <div class="field mb-0">
                            <o-radio v-model='orderType' :native-value='0'>
                                Orden alfabético
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
                        <div class="field mb-0">
                            <o-radio v-model='orderType' :native-value='3' v-if="this.indexedGrid.size > 0">
                                Por parrilla de salida
                            </o-radio>
                        </div>
                        <div class="field">
                            <o-switch v-model="orderAscendent">
                                Orden {{ orderAscendent ? "ascendente" : "descendente" }}
                            </o-switch>
                        </div>
                    </div>
                </o-collapse>

                <SlickList v-model:list="pilotosDisponibles" :group="session.name" :accept="[session.name]" tag="ul" :distance="1"
                           class="block-list has-radius no-select">

                    <SlickItem v-for="(item, index) in pilotosDisponiblesFiltrados" :key="item.id" :index="index" tag="li"
                               class="is-highlighted has-text-weight-semibold is-flex is-justify-content-space-between"
                               :style="styleDriverCard(item)">
                        <span>
                            {{ item.firstname }} {{ item.lastname }}
                            <span class="tag is-rounded" v-bind:style="styleDorsal(item)">#{{ item.number }}</span>
                            <o-tooltip class="ml-1" :label="currentUser.preferences['use-long-team-names'] ? item.team.name : item.team.longname">
                                <span v-if="currentUser.preferences['use-long-team-names']">{{ item.team.longname }}</span>
                                <span v-else>{{ item.team.name }}</span>
                            </o-tooltip>
                            ({{item.team.carname}})
                        </span>

                        <a @click="moveToTippList(item, index)" class="pl-3 pr-3 arrow-col has-text-primary">
                            <i class="is-hidden-touch mr-0 fas fa-angle-right"></i>
                            <i class="is-hidden-touch ml-0 fas fa-angle-right"></i>
                            <i class="is-hidden-desktop mt-0 fas fa-angle-up"></i>
                            <i class="is-hidden-desktop mb-0 fas fa-angle-up"></i>
                        </a>
                    </SlickItem>
                </SlickList>

            </div>

            <div class="column is-6">
                <h3>Pilotos pronosticados</h3>
                <SlickList v-model:list="pilotosPronosticados" :group="session.name" :accept="[session.name]" tag="ul" :distance="1"
                           class="block-list no-select">

                    <SlickItem v-for="(item, index) in pilotosPronosticados" :key="item.id" :index="index" tag="li"
                               class="is-highlighted has-text-weight-semibold has-radius is-flex is-justify-content-left"
                               :style="styleDriverCard(item)">

                        <a @click="moveToAvailableList(item, index)" class="mr-3 pl-3 arrow-col has-text-primary">
                            <i class="is-hidden-touch mr-0 fas fa-angle-left"></i>
                            <i class="is-hidden-touch ml-0 fas fa-angle-left"></i>
                            <i class="is-hidden-desktop mt-0 fas fa-angle-down"></i>
                            <i class="is-hidden-desktop mb-0 fas fa-angle-down"></i>
                        </a>

                        <span>
                            <b>{{ index + 1 }}º.</b> {{ item.firstname }} {{ item.lastname }}
                            <span class="tag is-rounded" v-bind:style="styleDorsal(item)">#{{ item.number }}</span>
                            <o-tooltip class="ml-1" :label="item.team.longname">
                                {{ item.team.name }}
                            </o-tooltip>
                            ({{item.team.carname}})
                        </span>
                    </SlickItem>
                </SlickList>

                <template v-if="this.session.isBeforeClosureDate()">
                    <o-button v-if="pilotosPronosticados.length === cantidadPilotosPronosticados(ruleSet, session)"
                              variant="success is-fullwidth"
                              @click="enviarPronostico">Enviar pronóstico
                    </o-button>

                    <div v-else class="notification is-warning is-light">
                        El pronóstico debe tener {{ cantidadPilotosPronosticados(ruleSet, session) }} pilotos escogidos y ordenados.
                    </div>
                </template>

                <o-button v-else disabled variant="success is-fullwidth">
                    Ya no se puede pronosticar
                </o-button>

                <hr v-if="(pilotosPronosticados.length > 0) && this.session.isBeforeClosureDate()"/>
                <o-button v-if="(pilotosPronosticados.length > 0) && this.session.isBeforeClosureDate()" variant="danger is-light is-fullwidth" @click="reiniciarPronostico">Limpiar pronóstico</o-button>

            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {RaceSession} from "@/types/RaceSession";
import { SlickList, SlickItem } from 'vue-slicksort';
import {grandPrixService} from "@/_services";
import {GrandPrix} from "@/types/GrandPrix";
import {Driver} from "@/types/Driver";
import {RaceResult} from "@/types/RaceResult";
import {StartGridPosition} from "@/types/StartGridPosition";
import {RuleSet} from "@/types/RuleSet";

import {defineComponent, PropType} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import {useStyles} from "@/composables/useStyles";

export default defineComponent({
    name: "SelectTipps",
    components: {
        SlickList,
        SlickItem,
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

        const currentUser = authStore.user;
        const currentCommunity = communityStore.community;
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
        moveToTippList(driver: Driver, index: number) {
            console.log("Moviendo a pronosticados " + driver.code);
            this.pilotosDisponibles.splice(index, 1);
            this.pilotosPronosticados.push(driver);
        },
        moveToAvailableList(driver: Driver, index: number) {
            console.log("Moviendo a disponibles " + driver.code);
            this.pilotosPronosticados.splice(index, 1);
            this.pilotosDisponibles.push(driver);
        },
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
                    this.$oruga.notification.open({
                        position: 'top',
                        message: "¡Has guardado tus pronósticos!",
                        variant: "success",
                    });
                },
                (error: any) => {
                    let message = "Error guardando tus pronósticos: " + error.message;

                    this.$oruga.notification.open({
                        position: 'top',
                        duration: 5000,
                        message: message,
                        variant: "danger",
                    });
                });
        }
    },
    computed: {
        pilotosDisponiblesFiltrados(): Array<Driver> {
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
    }
});
</script>

<style scoped lang="scss">
@import "bulma/sass/utilities/_all.sass";

.block-list:empty:before,
.block-list > div:empty:before {
    content: 'Coloca aquí tus pilotos en orden';
}
.no-select {
    user-select: none;
}

@media (max-width: $desktop) {
    .listas {
        display: flex;
        flex-direction: column-reverse;
    }
}
@media screen and (max-width: 1023px) {
    .arrow-col {
        display: flex;
        flex-direction: column;
    }
}
</style>