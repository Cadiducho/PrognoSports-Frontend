<template>
  <PTitle type="subtitle">
    Pilotos y equipos del Gran Premio
  </PTitle>

  <div class="flex flex-col md:flex-row gap-6">
    <div class="md:basis-1/5">
      <PSelect
        v-model="clonedGrandPrix"
        label="Clonar del Gran Premio..."
        @change="cloneDriversFromGrandPrix()"
      >
        <option
          v-for="gp in otherGPList"
          :key="gp.id"
          :value="gp"
        >
          {{ gp.name }}
        </option>
      </PSelect>

      <PLabel>
        Pilotos de <router-link
          class="text-brand-600 hover:underline dark:text-brand-300"
          :to="{name: 'adminDriversInSeason', params: {season: grandPrix.season.id}}"
        >
          {{ grandPrix.season.name }}
        </router-link>
      </PLabel>

      <draggable
        id="driversInSeason"
        class="w-full h-full select-none space-y-2 flex flex-col text-white"
        :list="driversInSeason"
        group="drivers"
        item-key="id"
      >
        <template #item="{ element }">
          <div class="flex cursor-move items-center justify-center rounded-lg bg-brand-accent-500 p-1 text-sm shadow-lg hover:bg-brand-accent-600">
            {{ element.firstname }} {{ element.lastname }} #{{ element.number }}
          </div>
        </template>
      </draggable>
    </div>
    <div class="min-w-0 md:basis-4/5">
      <PLabel>Pilotos en el Gran Premio</PLabel>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        <PCard
          v-for="constructor in constructorList"
          :key="constructor.id"
          tag="div"
          padding="sm"
          :title="constructor.name"
          :header-style="teamCarColor(constructor)"
        >
          <draggable
            :id="`driversByConstructor-${constructor.id}`"
            class="h-full min-h-12 w-full select-none space-y-2"
            :list="driversByConstructor[constructor.id]"
            group="drivers"
            item-key="id"
          >
            <template #item="{ element }">
              <div class="flex cursor-move items-center justify-center rounded-md bg-gray-100 px-2 py-1 text-center text-sm hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
                {{ element.firstname }} {{ element.lastname }} #{{ element.number }}
              </div>
            </template>
          </draggable>
        </PCard>
      </div>
      <PButton
        class="mt-3"
        @click="saveDrivers()"
      >
        Guardar pilotos
      </PButton>
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
import draggable from "vuedraggable";
import PSelect from "@/components/lib/forms/PSelect.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PLabel from "@/components/lib/forms/PLabel.vue";
import PTitle from "@/components/lib/PTitle.vue";
import PCard from "@/components/lib/PCard.vue";

export default defineComponent({
    name: "DriversInGrandPrix",
    components: {
      PCard,
      PTitle,
      PLabel,
      PButton,
      PSelect,
      draggable,
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
            }).catch(() => {
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

