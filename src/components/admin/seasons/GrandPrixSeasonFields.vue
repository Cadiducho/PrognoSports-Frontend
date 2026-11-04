<template>
  <PFormGrid :cols="2">
    <PSelect
      v-model="circuitId"
      label="Circuito"
      placeholder="Selecciona un circuito"
      span="full"
    >
      <option
        v-for="circuit in circuits"
        :key="circuit.id"
        :value="circuit.id"
      >
        {{ circuit.name }} ({{ circuit.locality }}, {{ circuit.country }})
      </option>
    </PSelect>

    <p
      v-if="isLoadingVariants"
      class="col-span-full text-sm text-gray-500 dark:text-gray-400"
    >
      <i
        class="fa fa-spinner fa-spin"
        aria-hidden="true"
      /> Cargando variantes...
    </p>
    <PSelect
      v-else-if="variants.length > 1"
      v-model="variantId"
      label="Variante del circuito"
      placeholder="Selecciona una variante"
      span="full"
    >
      <option
        v-for="variant in variants"
        :key="variant.id"
        :value="variant.id"
      >
        {{ variant.name }}
      </option>
    </PSelect>
    <PrognoAlert
      v-else-if="model.circuit && !variants.length"
      variant="warning"
      class="col-span-full"
    >
      Este circuito no tiene variantes. Créala antes desde la administración de circuitos.
    </PrognoAlert>

    <PField label="Vueltas">
      <PNumberInput
        :model-value="model.laps"
        :min="1"
        @update:model-value="set('laps', $event)"
      />
    </PField>
    <PField
      label="Ronda"
      :message="takenRoundsMessage"
    >
      <PNumberInput
        :model-value="model.round"
        :min="1"
        @update:model-value="set('round', $event)"
      />
    </PField>
    <p
      v-if="isRoundTaken"
      class="col-span-full text-sm text-error-700 dark:text-error-400"
    >
      La ronda {{ model.round }} ya está ocupada en esta temporada.
    </p>
  </PFormGrid>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {circuitService, grandPrixService} from "@/_services";
import {Circuit} from "@/types/Circuit";
import {Season} from "@/types/Season";
import PField from "@/components/lib/forms/PField.vue";
import PFormGrid from "@/components/lib/forms/PFormGrid.vue";
import PSelect from "@/components/lib/forms/PSelect.vue";
import PNumberInput from "@/components/lib/forms/PNumberInput.vue";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import {GrandPrixSeasonModel} from "@/components/admin/seasons/seasonLinkModels";

const model = defineModel<GrandPrixSeasonModel>({required: true});
const props = withDefaults(defineProps<{
  circuits: Circuit[];
  /** Si se indica, se sugiere la siguiente ronda libre y se avisa de las ocupadas */
  season?: Season;
}>(), {
  season: undefined,
});

const isLoadingVariants = ref(false);
const takenRounds = ref<number[]>([]);

const set = <K extends keyof GrandPrixSeasonModel>(key: K, value: GrandPrixSeasonModel[K]) => {
  model.value = {...model.value, [key]: value};
};

const variants = computed(() => model.value.circuit?.variants ?? []);

const circuitId = computed<number | ''>({
  get: () => model.value.circuit?.id ?? '',
  set: (id) => selectCircuit(props.circuits.find(circuit => circuit.id === id)),
});

const variantId = computed<number | ''>({
  get: () => model.value.variantId ?? '',
  set: (id) => set('variantId', id === '' ? undefined : id),
});

const selectCircuit = async (circuit: Circuit | undefined) => {
  model.value = {...model.value, circuit, variantId: undefined};
  if (!circuit) return;

  if (!circuit.variants.length) {
    isLoadingVariants.value = true;
    try {
      // Se cachean en el propio circuito para el resto de tarjetas
      circuit.variants.push(...await circuitService.listCircuitVariant(circuit));
    } finally {
      isLoadingVariants.value = false;
    }
  }

  // Variante por defecto: la única que haya, o la de Gran Premio
  const defaultVariant = circuit.variants.length === 1
    ? circuit.variants[0]
    : circuit.variants.find(variant => variant.isDefault());
  if (defaultVariant && model.value.circuit?.id === circuit.id) {
    set('variantId', defaultVariant.id);
  }
};

const isRoundTaken = computed(() => model.value.round != undefined && takenRounds.value.includes(model.value.round));
const takenRoundsMessage = computed(() => takenRounds.value.length
  ? `Ocupadas: ${takenRounds.value.join(', ')}`
  : '');

onMounted(async () => {
  if (!props.season) return;
  try {
    const gps = await grandPrixService.getGrandPrixesList(props.season);
    takenRounds.value = gps.map(gp => gp.round).filter(round => round != undefined).sort((a, b) => a - b);
    if (model.value.round == undefined) {
      set('round', Math.max(0, ...takenRounds.value) + 1);
    }
  } catch {
    // Sin la lista no se puede sugerir ronda; el backend validará igualmente que no esté repetida
  }
});
</script>
