<template>
  <PCard>
    <PTitle
      tag="h3"
      type="subtitle"
    >
      Resultados en {{ session.humanName() }}
    </PTitle>

    <section
      v-if="session.hasFastLap"
      class="mb-4"
    >
      <!-- ToDo: remove -->
      <o-field label="Vuelta rápida">
        <o-select
          v-model="fastLap"
          placeholder="Selecciona un piloto"
          expanded
        >
          <option
            v-for="driver in sessionResults"
            :key="driver.id"
            :value="driver"
          >
            {{ driver.lastname }}, {{ driver.firstname }} - {{ driver.team.name }} ({{ driver.team.carname }})
          </option>
        </o-select>
      </o-field>

      <hr>
    </section>

    <label class="label">Resultados</label>
    <PrognoAlert
      v-if="!hasSavedResults"
      variant="warning"
      message="No hay resultados guardados aún"
    />
    <draggable
      :id="`results-${session.id}`"
      class="w-full select-none space-y-2"
      :list="sessionResults"
      group="results"
      item-key="id"
    >
      <template #item="{ element, index }">
        <DraggableDriverCard
          :driver="element"
          :index="index"
          show-position
        />
      </template>
    </draggable>

    <section class="flex flex-col my-4 gap-2">
      <p-checkbox
        id="notSendNotification"
        v-model="notSendNotification"
        color="danger"
      >
        NO enviar notificación
      </p-checkbox>
      <p-checkbox
        id="notOverrideGrid"
        v-model="notOverrideGrid"
        color="danger"
      >
        NO sobreescribir parrilla
      </p-checkbox>
    </section>

    <PButton
      color="primary"
      @click="saveResults()"
    >
      Guardar resultados
    </PButton>
  </PCard>
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
import PTitle from "@/components/lib/PTitle.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PCard from "@/components/lib/PCard.vue";
import PCheckbox from "@/components/lib/forms/PCheckbox.vue";

export default defineComponent({
    name: "EditResults",
    components: {
      PCheckbox,
      PCard,
        PButton,
        PTitle,
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
