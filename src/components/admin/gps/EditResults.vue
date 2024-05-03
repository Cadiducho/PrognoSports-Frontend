<template>
    <h3 class="subtitle">Resultados en {{ session.humanName() }}</h3>

    <section v-if="session.hasFastLap" class="mb-4">
        <o-field label="Vuelta rápida">
            <o-select v-model="fastLap" placeholder="Selecciona un piloto" expanded>
                <option
                    v-for="driver in sessionResults"
                    :value="driver"
                    :key="driver.id">
                    {{ driver.lastname}}, {{driver.firstname}} - {{ driver.team.name }} ({{ driver.team.carname }})
                </option>
            </o-select>
        </o-field>

        <hr/>
    </section>

    <label class="label">Resultados</label>
    <PrognoAlert v-if="!hasSavedResults" variant="warning" message="No hay resultados guardada aún" />
    <draggable
        :id="`results-${session.id}`"
        class="w-full select-none space-y-2"
        :list="sessionResults"
        group="results"
        itemKey="id"
    >
        <template #item="{ element, index }">
            <DraggableDriverCard :driver="element" :index="index" showPosition />
        </template>
    </draggable>

    <section class="block mt-4">
        <o-checkbox
            v-model="notSendNotification"
            variant="danger"
            passive-variant="primary">
            NO enviar notificación
        </o-checkbox>
        <o-checkbox
            v-model="notOverrideGrid"
            variant="danger"
            passive-variant="primary">
            NO sobreescribir parrilla
        </o-checkbox>
    </section>

    <button class="button is-primary" @click="saveResults()">Guardar resultados</button>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {useAuthStore} from "@/store/authStore";
import {RaceSession} from "@/types/RaceSession";
import {Driver} from "@/types/Driver";
import {grandPrixService, notificationService} from "@/_services";
import {GrandPrix} from "@/types/GrandPrix";
import DraggableDriverCard from "@/components/gps/DraggableDriverCard.vue";
import draggable from "vuedraggable";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";

export default defineComponent({
    name: "EditResults",
    components: {
        PrognoAlert,
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
        resultsInSession: {
            type: Object as PropType<Array<Driver>>,
            required: true,
        },
        hasSavedResults: {
            type: Boolean,
            default: false,
        }
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
            sessionResults: [...this.resultsInSession],
        }
    },
    methods: {
        saveResults() {
            const payload = {
                results: new Map(this.sessionResults.map((driver, index, array) => [index + 1, driver.id])),
                notSendNotification: this.notSendNotification,
            };
            grandPrixService.saveResults(this.grandPrix, this.session, payload).then(() => {
                notificationService.showNotification( "¡Has guardado los resultados!");
            });
        }
    }
});
</script>

<style scoped>

</style>