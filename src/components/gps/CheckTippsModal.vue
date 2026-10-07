<template>
  <PrognoModal
    v-model="visible"
    @close="$emit('close')"
    @handle="handleSimulate"
  >
    <template #title>
      Simular resultados de {{ session.humanName() }}
    </template>

    <template #content>
      <div class="py-2">
        <!-- Listado único draggable -->
        <section class="flex flex-col">
          <h4 class="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
            Ordena los pilotos ({{ pilotosOrdenados.length }} total)
          </h4>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Debes especificar todo el orden a pesar de pronosticar solo los {{ cantidadPronosticados }} primeros.
          </p>

          <draggable
            :id="`simulated-drivers-${session.id}`"
            class="flex min-h-[200px] flex-wrap content-start gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/50 p-4 transition hover:border-gray-400 md:min-h-[250px] dark:border-gray-600 dark:bg-gray-800/40 dark:hover:border-gray-500"
            :list="pilotosOrdenados"
            group="simulated-drivers"
            item-key="id"
          >
            <template #item="{ element, index }">
              <div class="flex items-center">
                <SmallDriverCard
                  :driver="element"
                  :position="index + 1"
                />
              </div>
            </template>
          </draggable>
        </section>
      </div>
    </template>

    <template #saveText>
      Ver simulación
    </template>

    <template #cancelText>
      Cancelar
    </template>
  </PrognoModal>
</template>

<script setup lang="ts">
import { RaceSession } from "@/types/RaceSession";
import { GrandPrix } from "@/types/GrandPrix";
import { Driver } from "@/types/Driver";
import { RuleSet } from "@/types/RuleSet";
import { computed, onMounted, ref } from "vue";
import draggable from 'vuedraggable'
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import SmallDriverCard from "@/components/gps/SmallDriverCard.vue";
import PrognoModal from "@/components/lib/PrognoModal.vue";
import {RaceResult} from "@/types/RaceResult";

const visible = defineModel<boolean>();
const props = defineProps<{
  session: RaceSession;
  grandPrix: GrandPrix;
  ruleSet: RuleSet;
  drivers: Array<Driver>;
  userTipps?: Array<RaceResult>;
}>();

const emit = defineEmits<{
  close: [];
  simulate: [drivers: Driver[]];
}>();

const pilotosOrdenados = ref(new Array<Driver>());

const cantidadPronosticados = computed(() => props.ruleSet.cantidadPilotosPronosticados(props.session));

const handleSimulate = () => {
  // Se emite la lista completa de piltos
  emit('simulate', pilotosOrdenados.value);
  visible.value = false;
  emit('close');
};

onMounted(() => {
  // Si existen pronósticos del usuario, ordenar los pilotos según su posición
  if (props.userTipps && props.userTipps.length > 0) {
    const orderedUserTipps = [...props.userTipps]
      .sort((a, b) => a.position - b.position)
      .map((tip) => tip.driver)

    const userTippsIds = orderedUserTipps.map((driver) => driver.id);
    pilotosOrdenados.value = [
      ...orderedUserTipps,
      ...props.drivers.filter((driver) => !userTippsIds.includes(driver.id))
    ];
  } else {
    pilotosOrdenados.value = [...props.drivers];
  }
});
</script>
