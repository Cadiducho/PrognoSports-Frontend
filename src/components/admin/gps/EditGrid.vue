<template>
    <h3 class="subtitle">Parrilla de salida para {{ session.humanName() }}</h3>

    <label class="label">Parrilla</label>
    <draggable
        :id="`grid-${session.id}`"
        class="w-full select-none space-y-2"
        :list="sessionGrid"
        group="grid"
        itemKey="id"
    >
        <template #item="{ element, index }">
            <DraggableDriverCard :driver="element.driver" :index="index" showPosition />
        </template>
    </draggable>

    <button class="mt-2 button is-primary" @click="saveGrid()">Guardar parrilla</button>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {useAuthStore} from "@/store/authStore";
import {RaceSession} from "@/types/RaceSession";
import {Driver} from "@/types/Driver";
import {GrandPrix} from "@/types/GrandPrix";
import DraggableDriverCard from "@/components/gps/DraggableDriverCard.vue";
import draggable from "vuedraggable";
import {StartGridPosition} from "@/types/StartGridPosition";
import {grandPrixService, notificationService} from "@/_services";

export default defineComponent({
    name: "EditGrid",
    components: {
        draggable,
        DraggableDriverCard,
    },
    props: {
        grandPrix: {
            type: Object as PropType<GrandPrix>,
            required: true,
        },
        session: {
            type: Object as PropType<RaceSession>,
            required: true,
        },
        grid: {
            type: Object as PropType<Array<StartGridPosition>>,
            required: true,
        },
    },
    setup() {
        const authStore = useAuthStore();

        const currentUser = authStore.loggedUser;

        return {currentUser};
    },
    data() {
        return {
            notSendNotification: false,
            notOverrideGrid: false,
            fastLap: {} as Driver,
            sessionGrid: [...this.grid],
        }
    },
    methods: {
        saveGrid() {
            console.log("saveGrid");
            const payload = {
                grid: this.sessionGrid.map((gridPosition: StartGridPosition, index: number, array: StartGridPosition[]) => {
                    return {
                        driver: gridPosition.driver.id,
                        isFromPit: gridPosition.isFromPit,
                        note: gridPosition.note,
                        position: index + 1,
                    }
                })
            };
            console.log(payload)

            grandPrixService.saveGrid(this.grandPrix, this.session, payload).then(() => {
                notificationService.showNotification( "¡Has guardado la parrilla!");
            });
        }
    }
});
</script>

<style scoped>

</style>