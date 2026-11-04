<template>
  <PStepper
    v-model="activeStep"
    :steps="stepperSteps"
    keep-mounted
  >
    <template
      v-for="(_, index) in wizard.steps"
      :key="index"
      #[`step-${index}`]
    >
      <slot :name="`step-${index}`" />
    </template>
  </PStepper>

  <PrognoAlert
    v-if="error"
    variant="danger"
    class="mt-4"
  >
    {{ error }}
  </PrognoAlert>

  <footer
    v-if="showFooter"
    class="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-4 dark:border-gray-700"
  >
    <PButton
      v-if="!isFirst"
      type="outline"
      color="info"
      icon="fa fa-chevron-left"
      :disabled="!canGoBack"
      @click="wizard.back()"
    >
      Atrás
    </PButton>
    <span v-else />

    <div class="flex flex-wrap gap-2">
      <PButton
        v-if="currentStep.skippable && !isLast"
        type="ghost"
        color="info"
        :disabled="isBusy || isWorking"
        @click="wizard.skip()"
      >
        Saltar este paso
      </PButton>
      <PButton
        v-if="!isLast || finishLabel"
        :disabled="!canAdvance"
        @click="advance"
      >
        <i
          v-if="isBusy || isWorking"
          class="fa fa-spinner fa-spin"
          aria-hidden="true"
        />
        {{ nextLabel }}
        <i
          v-if="!isBusy && !isWorking && !isLast"
          class="fa fa-chevron-right"
          aria-hidden="true"
        />
      </PButton>
    </div>
  </footer>
</template>

<script setup lang="ts">
import {computed} from "vue";
import PStepper from "@/components/lib/PStepper.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import {Wizard} from "@/composables/useWizard";

/**
 * Wizard por pasos: cabecera de progreso, contenido de cada paso (slots `step-0`, `step-1`, ...) y
 * botones Atrás / Saltar / Siguiente. El estado vive en `useWizard`.
 */
const props = withDefaults(defineProps<{
  wizard: Wizard;
  /** Texto del botón del último paso. Si no se indica, el último paso no muestra botón de avanzar */
  finishLabel?: string;
  /** Oculta la barra de navegación inferior en el último paso */
  hideFooterOnLast?: boolean;
}>(), {
  finishLabel: undefined,
  hideFooterOnLast: false,
});

const emit = defineEmits<{
  finish: [];
}>();

const {current, currentStep, stepperSteps, isFirst, isLast, canGoBack, canAdvance, isBusy, isWorking, error} = props.wizard;

const activeStep = computed({
  get: () => current.value,
  set: (index: number) => props.wizard.goTo(index),
});

const showFooter = computed(() => !(isLast.value && props.hideFooterOnLast));

const nextLabel = computed(() => {
  if (currentStep.value.nextLabel) return currentStep.value.nextLabel;
  return isLast.value ? props.finishLabel : 'Siguiente';
});

const advance = async () => {
  const wasLast = isLast.value;
  const ok = await props.wizard.next();
  if (ok && wasLast) emit('finish');
};
</script>
