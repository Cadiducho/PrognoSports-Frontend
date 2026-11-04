<template>
  <PFormGrid :cols="2">
    <PInput
      :model-value="model.fullname"
      label="Nombre largo"
      placeholder="Oracle Red Bull Racing"
      name="fullname"
      @update:model-value="set('fullname', String($event ?? ''))"
    />
    <PInput
      :model-value="model.car"
      label="Nombre del coche"
      placeholder="RB21"
      name="car"
      @update:model-value="set('car', String($event ?? ''))"
    />
    <PField
      label="Color del equipo"
      span="full"
    >
      <ColorPicker
        :model-value="model.teamcolor"
        required
        @update:model-value="set('teamcolor', $event)"
      />
    </PField>
  </PFormGrid>
</template>

<script setup lang="ts">
import PField from "@/components/lib/forms/PField.vue";
import PFormGrid from "@/components/lib/forms/PFormGrid.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import ColorPicker from "@/components/lib/forms/ColorPicker.vue";
import {ConstructorSeasonModel} from "@/components/admin/seasons/seasonLinkModels";

const model = defineModel<ConstructorSeasonModel>({required: true});

const set = <K extends keyof ConstructorSeasonModel>(key: K, value: ConstructorSeasonModel[K]) => {
  model.value = {...model.value, [key]: value};
};
</script>
