<template>
  <PFormGrid :cols="2">
    <PField
      label="Dorsal"
      message="Entre 0 y 99"
    >
      <PNumberInput
        :model-value="model.number"
        :min="0"
        :max="99"
        @update:model-value="set('number', $event)"
      />
    </PField>
    <PField label="Color del piloto">
      <ColorPicker
        :model-value="model.color"
        required
        @update:model-value="set('color', $event)"
      />
    </PField>
  </PFormGrid>
</template>

<script setup lang="ts">
import PField from "@/components/lib/forms/PField.vue";
import PFormGrid from "@/components/lib/forms/PFormGrid.vue";
import PNumberInput from "@/components/lib/forms/PNumberInput.vue";
import ColorPicker from "@/components/lib/forms/ColorPicker.vue";
import {DriverSeasonModel} from "@/components/admin/seasons/seasonLinkModels";

const model = defineModel<DriverSeasonModel>({required: true});

const set = <K extends keyof DriverSeasonModel>(key: K, value: DriverSeasonModel[K]) => {
  model.value = {...model.value, [key]: value};
};
</script>
