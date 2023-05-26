<template>
    <h2 class="title">Pilotos y equipos del Gran Premio</h2>

    <o-field label="Clonar del Gran Premio...">
        <o-select v-model="clonedGrandPrix" placeholder="Seleciona un Gran Premio" @change="cloneDriversFromGrandPrix()">
            <option v-for="gp in otherGPList" :value="gp" :key="gp.id">{{ gp.name }}</option>
        </o-select>
    </o-field>

    <div class="columns">

        <div class="column is-one-fifth">
            <label class="label">Pilotos de <router-link :to="{name: 'adminSeasonEdit', params: grandPrix.season.id}">{{ grandPrix.season.name }}</router-link></label>

            <draggable
                id="driversInSeason"
                class="w-full h-full select-none space-y-2 flex flex-col text-white"
                :list="driversInSeason"
                group="drivers"
                itemKey="id"
            >
                <template #item="{ element, index }">
                    <div class="p-1 cursor-move rounded-lg flex items-center justify-center bg-cyan-400 hover:bg-cyan-600 shadow-lg">
                        {{ element.firstname }} {{ element.lastname }}
                    </div>
                </template>
            </draggable>

        </div>
        <div class="column">

            <label class="label">Pilotos en el Gran Premio</label>
            <div class="columns is-multiline">
                <div class="column is-2" v-for="constructor in constructorList">
                    <div class="card">
                        <header class="card-header">
                            <p class="card-header-title" :style="teamCarColor(constructor)">
                                {{ constructor.name }}
                            </p>
                        </header>

                        <div class="card-content">
                            <draggable
                                :id="`driversByConstructor-${constructor.id}`"
                                class="w-full h-full select-none space-y-2"
                                :list="driversByConstructor[constructor.id]"
                                group="drivers"
                                itemKey="id"
                            >
                                <template #item="{ element, index }">
                                    <div class="cursor-move flex items-center justify-center">
                                        {{ element.firstname }} {{ element.lastname }}
                                    </div>
                                </template>
                            </draggable>
                        </div>
                    </div>
                </div>
            </div>
            <button class="button is-primary" @click="saveDrivers()">Guardar pilotos</button>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {GrandPrix} from "@/types/GrandPrix";
import {useDayjs} from "@/composables/useDayjs";
import {Dictionary} from "@/types/Dictionary";
import {Driver} from "@/types/Driver";
import {Constructor} from "@/types/Constructor";
import {constructorService, driversService, grandPrixService, notificationService} from "@/_services";
import {useStyles} from "@/composables/useStyles";
import DraggableDriverCard from "@/components/gps/DraggableDriverCard.vue";
import draggable from "vuedraggable";

export default defineComponent({
    name: "DriversInGrandPrix",
    components: {
        draggable,
        DraggableDriverCard,
    },
    props: {
        grandPrix: {
            type: Object as PropType<GrandPrix>,
            required: true,
        },
    },
    setup() {
        const dayjs = useDayjs();
        const colorUtils = useStyles();

        const humanDateTime = dayjs.humanDateTime;
        const invertColor = colorUtils.invertColor;
        return { humanDateTime, invertColor };
    },
    data() {
        return {
            driversInSeason: new Array<Driver>(),
            driversInGrandPrix: new Array<Driver>(),

            constructorList: new Array<Constructor>(),
            driversByConstructor: {} as Dictionary<string, Array<Driver>>,

            otherGPList: new Array<GrandPrix>(),
            clonedGrandPrix: {} as GrandPrix,
        }
    },
    mounted() {
        driversService.getDriversInSeason(this.grandPrix.season).then((listDrivers) => {

            this.driversInSeason = [];
            this.driversInSeason.push(...listDrivers);
            this.driversInSeason.sort((a, b) => a.lastname.localeCompare(b.lastname))

            this.loadDriversInGrandPrix(this.grandPrix);
        });

        grandPrixService.getGrandPrixesList(this.grandPrix.season).then((list) => {
            this.otherGPList = [];
            this.otherGPList.push(...list);
        });
    },
    methods: {
        cloneDriversFromGrandPrix() {
            console.log("Clonando de " + JSON.stringify(this.clonedGrandPrix));
            this.clonedGrandPrix.competition = this.grandPrix.competition;
            this.clonedGrandPrix.season = this.grandPrix.season;
            this.loadDriversInGrandPrix(this.clonedGrandPrix);
        },
        loadDriversInGrandPrix(gp: GrandPrix) {
            driversService.getDriversInGrandPrix(gp).then((listGP) => {
                this.driversInGrandPrix = [];
                this.driversInGrandPrix.push(...listGP);

                constructorService.getConstructorsInSeason(gp.season).then((listC) => {
                    this.constructorList = [];
                    this.constructorList.push(...listC);

                    this.constructorList.forEach((c) => {
                        this.driversByConstructor[c.id] = [];
                    })

                    this.driversInGrandPrix.forEach((d) => {
                        this.driversByConstructor[d.team.id] = [...this.driversByConstructor[d.team.id]??[], d];
                    });
                })
            });
        },
        saveDrivers() {
            if (this.driversByConstructor) {
                driversService.setDriversInGrandPrix(this.grandPrix, this.driversByConstructor).then(() => {
                    notificationService.showNotification( "Lista de pilotos guardada correctamente.");
                }).catch((error) => {
                    notificationService.showNotification( "Ha ocurrido un error.", "error");
                });
            }
        },
        teamCarColor(constructor: Constructor) {
            return {
                color: this.invertColor(constructor.teamcolor),
                fontWeight: 'bold',
                backgroundColor: '#' + constructor.teamcolor,
            }
        },
    }
});
</script>

<style scoped>

</style>