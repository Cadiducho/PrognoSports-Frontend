<template>
  <div class="flex flex-col gap-3">
    <ul
      v-if="sessions.length"
      class="flex flex-col gap-1"
    >
      <li
        v-for="session in sortedSessions"
        :key="session.id"
        class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
      >
        <i
          class="fa fa-check text-success-600 dark:text-success-400"
          aria-hidden="true"
        />
        <b>{{ sessionHumanName(session) }}</b>
        <span>{{ humanDateTime(session.date) }}</span>
      </li>
    </ul>
    <p
      v-else
      class="text-sm text-gray-500 dark:text-gray-400"
    >
      Sin sesiones todavía.
    </p>

    <div class="grid grid-cols-1 gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/60">
      <PSelect
        v-model="newSessionId"
        label="Sesión"
        placeholder="Selecciona un tipo de sesión"
      >
        <option
          v-for="type in availableTypes"
          :key="type.id"
          :value="type.id"
        >
          {{ sessionHumanName(type) }}
        </option>
      </PSelect>
      <PSelect
        v-if="sessions.length"
        v-model="definingId"
        label="Define la parrilla de (opcional)"
        placeholder="Ninguna"
      >
        <option :value="0">
          Ninguna
        </option>
        <option
          v-for="session in sortedSessions"
          :key="session.id"
          :value="session.id"
        >
          {{ sessionHumanName(session) }}
        </option>
      </PSelect>
      <PField label="Fecha y hora">
        <CalendarDateTimePicker
          v-model="newSessionDate"
          placeholder="Click para escoger..."
          :show-time="true"
        />
      </PField>
      <PButton
        size="small"
        icon="fa fa-plus"
        :disabled="!canAdd || isSaving"
        @click="addSession"
      >
        Añadir sesión
      </PButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {notificationService, sessionService} from "@/_services";
import {GrandPrix} from "@/types/GrandPrix";
import {RaceSession} from "@/types/RaceSession";
import {useDayjs} from "@/composables/useDayjs";
import {errorMessage} from "@/composables/errorMessage";
import {isValidDate} from "@/utils/adminValidators";
import PSelect from "@/components/lib/forms/PSelect.vue";
import PField from "@/components/lib/forms/PField.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import CalendarDateTimePicker from "@/components/lib/CalendarDateTimePicker.vue";
import {sessionHumanName} from "@/utils/raceSession";

/**
 * Alta rápida de sesiones de un gran premio ya enlazado a una temporada.
 */
const props = defineProps<{
  grandPrix: Pick<GrandPrix, "id" | "competition" | "season">;
  /** Tipos de sesión disponibles (`sessionService.getSessionList()`) */
  sessionTypes: RaceSession[];
}>();

const emit = defineEmits<{
  added: [session: RaceSession];
  /** Si se está guardando una sesión */
  busy: [busy: boolean];
}>();

const {humanDateTime} = useDayjs();

const sessions = ref<RaceSession[]>([]);
const newSessionId = ref<number | ''>('');
const definingId = ref<number>(0);
const newSessionDate = ref<Date | null>(null);
const isSaving = ref(false);

const sortedSessions = computed(() => [...sessions.value].sort((a, b) => a.date.getTime() - b.date.getTime()));
const availableTypes = computed(() => props.sessionTypes.filter(type => !sessions.value.some(s => s.id === type.id)));
const canAdd = computed(() => newSessionId.value !== '' && isValidDate(newSessionDate.value));

const addSession = async () => {
  if (!canAdd.value) return;
  isSaving.value = true;
  emit('busy', true);
  try {
    const session = await sessionService.addSessionInGrandPrix(props.grandPrix, {
      session: newSessionId.value as number,
      date: newSessionDate.value!,
      defining: definingId.value,
    });
    sessions.value.push(session);
    emit('added', session);
    newSessionId.value = '';
    definingId.value = 0;
  } catch (e) {
    notificationService.showNotification(errorMessage(e) ?? 'No se ha podido añadir la sesión', 'error');
  } finally {
    isSaving.value = false;
    emit('busy', false);
  }
};
</script>
