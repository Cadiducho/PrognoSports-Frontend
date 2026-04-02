<template>
  <PrognoModal
    v-show="modelValue"
    @close="$emit('close')"
    @handle="handleSimulate"
  >
    <template #title>
      Simular resultados
    </template>

    <template #content>
      <div class="simulate-container">
        <!-- Listado único draggable -->
        <section class="results-section">
          <h4 class="section-title dark:text-gray-300 mb-3">
            Ordena los pilotos ({{ pilotosOrdenados.length }} total)
          </h4>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Los primeros {{ cantidadPronosticados }} serán los resultados simulados
          </p>

          <draggable
            :id="`simulated-drivers-${session.id}`"
            class="drivers-list"
            :list="pilotosOrdenados"
            group="simulated-drivers"
            item-key="id"
          >
            <template #item="{ element, index }">
              <div class="driver-item">
                <SmallDriverCard
                  :driver="element"
                  :position="index + 1"
                />
              </div>
            </template>
          </draggable>
        </section>

        <!-- Alerta de validación -->
        <PrognoAlert
          variant="info"
          class="mt-4"
        >
          <i class="fas fa-info-circle mr-2" /> Los primeros {{ cantidadPronosticados }} pilotos serán los resultados simulados
        </PrognoAlert>
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

const props = defineProps<{
  modelValue: boolean;
  session: RaceSession;
  grandPrix: GrandPrix;
  ruleSet: RuleSet;
  drivers: Array<Driver>;
  userTipps?: Array<Driver>;
}>();

const emit = defineEmits<{
  close: [];
  simulate: [drivers: Driver[]];
}>();

const pilotosOrdenados = ref(new Array<Driver>());

const cantidadPronosticados = computed(() => props.ruleSet.cantidadPilotosPronosticados(props.session));

const handleSimulate = () => {
  // Los primeros N pilotos son los seleccionados
  const pilotosSimulados = pilotosOrdenados.value.slice(0, cantidadPronosticados.value);
  emit('simulate', pilotosSimulados);
  emit('close');
};

onMounted(() => {
  // Si existen pronósticos del usuario, ordenar los pilotos según ese orden
  if (props.userTipps && props.userTipps.length > 0) {
    const userTippsIds = props.userTipps.map(d => d.id);
    const ordered = [
      ...props.userTipps,
      ...props.drivers.filter(d => !userTippsIds.includes(d.id))
    ];
    pilotosOrdenados.value = ordered;
  } else {
    pilotosOrdenados.value = [...props.drivers];
  }
});
</script>

<style scoped lang="scss">
.simulate-container {
  padding: 0.5rem 0;
}

.results-section {
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 0.95rem;
  font-weight: 600;
}

.drivers-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 1.25rem;
  border: 2px dashed rgba(100, 100, 100, 0.3);
  border-radius: 0.5rem;
  min-height: 250px;
  align-content: flex-start;
  background: rgba(50, 50, 50, 0.02);
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(100, 100, 100, 0.5);
    background: rgba(50, 50, 50, 0.05);
  }
}

.driver-item {
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .drivers-list {
    min-height: 200px;
  }
}
</style>












