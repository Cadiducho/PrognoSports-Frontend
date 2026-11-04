import {computed, ref, Ref, ComputedRef} from "vue";
import {errorMessage} from "@/composables/errorMessage";

/** Mismo formato que `StepperStep` de `PStepper.vue` */
interface StepperStep {
  label: string;
  description?: string;
  completed?: boolean;
  disabled?: boolean;
}

/**
 * Definición de un paso del wizard.
 */
export interface WizardStepDef {
  label: string;
  description?: string;
  /** Si el paso tiene datos suficientes para avanzar. Por defecto, siempre */
  canAdvance?: () => boolean;
  /**
   * Acción al pulsar "Siguiente" (p. ej. el POST que crea la entidad). Si lanza un error, el wizard
   * se queda en el paso y muestra el mensaje.
   */
  onLeave?: () => Promise<void> | void;
  /**
   * Una vez completado, el paso ya no se puede volver a visitar. Úsalo en los pasos que crean algo en el
   * servidor para no enviarlo dos veces.
   */
  lockOnComplete?: boolean;
  /** Texto del botón de avanzar para este paso (por defecto "Siguiente" o "Finalizar") */
  nextLabel?: string;
  /** Permite saltar el paso sin cumplir `canAdvance` (paso opcional) */
  skippable?: boolean;
}

export interface Wizard {
  steps: WizardStepDef[];
  current: Ref<number>;
  currentStep: ComputedRef<WizardStepDef>;
  stepperSteps: ComputedRef<StepperStep[]>;
  isFirst: ComputedRef<boolean>;
  isLast: ComputedRef<boolean>;
  canGoBack: ComputedRef<boolean>;
  canAdvance: ComputedRef<boolean>;
  isBusy: Ref<boolean>;
  /** Si algún paso tiene trabajo en curso (ver `setWorking`) */
  isWorking: ComputedRef<boolean>;
  error: Ref<string | undefined>;
  isCompleted: (index: number) => boolean;
  next: () => Promise<boolean>;
  skip: () => void;
  back: () => void;
  goTo: (index: number) => void;
  /**
   * Marca trabajo en curso dentro de un paso (p. ej. enlaces que aún se están enviando). Mientras haya
   * alguno no se puede navegar, para no dar el paso por terminado antes de que lleguen sus resultados.
   */
  setWorking: (key: string, working: boolean) => void;
}

/**
 * Estado y navegación de un wizard por pasos. Se combina con `PWizard`, que pinta la cabecera
 * (`PStepper`) y los botones de navegación.
 *
 * ```ts
 * const wizard = useWizard([
 *   {label: 'Datos', canAdvance: () => isValid.value, onLeave: create, lockOnComplete: true},
 *   {label: 'Temporadas', skippable: true},
 *   {label: 'Resumen'},
 * ]);
 * ```
 */
export function useWizard(steps: WizardStepDef[]): Wizard {
  const current = ref(0);
  const completed = ref(new Set<number>());
  const isBusy = ref(false);
  const error = ref<string | undefined>();
  const workingKeys = ref(new Set<string>());
  const isWorking = computed(() => workingKeys.value.size > 0);
  const isBlocked = computed(() => isBusy.value || isWorking.value);

  const setWorking = (key: string, working: boolean) => {
    if (workingKeys.value.has(key) === working) return;
    const set = new Set(workingKeys.value);
    if (working) set.add(key); else set.delete(key);
    workingKeys.value = set;
  };

  const isCompleted = (index: number) => completed.value.has(index);
  const isLocked = (index: number) => !!steps[index].lockOnComplete && isCompleted(index);

  // Se puede ir a un paso si no está bloqueado y todos los anteriores están completados
  const isReachable = (index: number) => {
    if (index === current.value) return true;
    if (isLocked(index)) return false;
    for (let i = 0; i < index; i++) {
      if (!isCompleted(i)) return false;
    }
    return true;
  };

  const currentStep = computed(() => steps[current.value]);
  const isFirst = computed(() => current.value === 0);
  const isLast = computed(() => current.value === steps.length - 1);
  const canGoBack = computed(() => !isFirst.value && !isBlocked.value && isReachable(current.value - 1));
  const canAdvance = computed(() => !isBlocked.value && (currentStep.value.canAdvance?.() ?? true));

  const stepperSteps = computed<StepperStep[]>(() => steps.map((step, index) => ({
    label: step.label,
    description: step.description,
    completed: isCompleted(index),
    disabled: isBlocked.value || !isReachable(index),
  })));

  const markCompleted = (index: number) => {
    const set = new Set(completed.value);
    set.add(index);
    completed.value = set;
  };

  const goTo = (index: number) => {
    if (isBlocked.value && index !== current.value) return;
    if (index < 0 || index >= steps.length || !isReachable(index)) return;
    error.value = undefined;
    current.value = index;
  };

  const next = async (): Promise<boolean> => {
    if (!canAdvance.value) return false;
    error.value = undefined;
    isBusy.value = true;
    try {
      await currentStep.value.onLeave?.();
    } catch (e) {
      error.value = errorMessage(e) ?? "Ha ocurrido un error inesperado";
      return false;
    } finally {
      isBusy.value = false;
    }
    markCompleted(current.value);
    if (!isLast.value) current.value++;
    return true;
  };

  const skip = () => {
    if (!currentStep.value.skippable || isLast.value || isBlocked.value) return;
    error.value = undefined;
    markCompleted(current.value);
    current.value++;
  };

  const back = () => {
    if (canGoBack.value) goTo(current.value - 1);
  };

  return {
    steps, current, currentStep, stepperSteps, isFirst, isLast, canGoBack, canAdvance, isBusy, isWorking, error,
    isCompleted, next, skip, back, goTo, setWorking,
  };
}
