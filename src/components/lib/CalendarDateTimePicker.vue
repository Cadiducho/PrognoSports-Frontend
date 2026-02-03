<template>
  <div
    ref="calendarContainer"
    class="relative w-full"
  >
    <!-- Input del calendario -->
    <div class="relative">
      <label
        v-if="label"
        :for="inputId"
        class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {{ label }}
      </label>

      <div class="relative">
        <input
          :id="inputId"
          type="text"
          :value="formattedDateTime"
          readonly
          class="bg-white dark:dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 pr-10 cursor-pointer shadow-sm transition-colors duration-300"
          :placeholder="placeholder"
          @click="toggleCalendar"
        >
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <i class="fas fa-calendar text-gray-500 dark:text-gray-400" />
        </div>
      </div>

      <!-- Calendario desplegable como popup -->
      <div
        v-if="showCalendar"
        class="absolute z-50 top-full left-0 mt-2 w-full max-w-[320px] bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 border border-gray-200 dark:border-gray-700 max-sm:fixed max-sm:top-1/2 max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:-translate-y-1/2 max-sm:w-[90%] max-sm:max-w-[400px] max-sm:mt-0"
      >
        <!-- Encabezado del calendario -->
        <div class="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
          <!-- Botones de navegación año anterior y mes anterior -->
          <div class="flex gap-1">
            <button
              type="button"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
              @click="navigateYear(-1)"
            >
              <i class="fas fa-angle-double-left text-xs sm:text-base" />
            </button>
            <button
              type="button"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
              @click="navigateMonth(-1)"
            >
              <i class="fas fa-angle-left text-xs sm:text-base" />
            </button>
          </div>

          <!-- Título del mes y año -->
          <h2 class="text-base sm:text-lg font-semibold text-gray-800 dark:text-white text-center min-w-[120px] sm:min-w-[140px]">
            {{ monthNames[currentMonth] }} {{ currentYear }}
          </h2>

          <!-- Botones de navegación mes siguiente y año siguiente -->
          <div class="flex gap-1">
            <button
              type="button"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
              @click="navigateMonth(1)"
            >
              <i class="fas fa-angle-right text-xs sm:text-base" />
            </button>
            <button
              type="button"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
              @click="navigateYear(1)"
            >
              <i class="fas fa-angle-double-right text-xs sm:text-base" />
            </button>
          </div>
        </div>

        <!-- Días de la semana (Lunes primero) -->
        <div class="grid grid-cols-7 gap-1 mb-2">
          <div
            v-for="day in weekDays"
            :key="day"
            class="text-center text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 py-1 sm:py-2"
          >
            {{ day }}
          </div>
        </div>

        <!-- Días del mes -->
        <div class="grid grid-cols-7 gap-1 mb-4">
          <div
            v-for="emptyDay in emptyDays"
            :key="`empty-${emptyDay}`"
            class="h-8 sm:h-10 flex items-center justify-center text-gray-400 dark:text-gray-600"
          /><button
            v-for="day in daysInMonth"
            :key="day"
            type="button"
            class="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium transition-all duration-200"
            :class="getDayClasses(day)"
            @click="selectDay(day)"
          >
            {{ day }}
          </button>
        </div>

        <!-- Selector de hora en formato 24h -->
        <div
          v-if="showTime"
          class="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4"
        >
          <h3 class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Seleccionar hora (24h)
          </h3>
          <div class="flex items-center justify-center space-x-2 sm:space-x-4">
            <!-- Horas (24h) -->
            <div class="w-20 sm:w-24">
              <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1 text-center">
                Horas
              </label>
              <div class="relative">
                <select
                  v-model="tempSelectedHour"
                  class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-xs sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 sm:p-2.5 appearance-none cursor-pointer text-center"
                >
                  <option
                    v-for="hour in hours"
                    :key="hour"
                    :value="hour"
                  >
                    {{ hour.toString().padStart(2, '0') }}
                  </option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <i class="fas fa-chevron-down text-gray-400 text-xs" />
                </div>
              </div>
            </div>

            <!-- Separador visual -->
            <div class="flex items-end justify-center pb-2">
              <span class="text-lg sm:text-xl font-bold text-gray-500 dark:text-gray-400">:</span>
            </div>

            <!-- Minutos -->
            <div class="w-20 sm:w-24">
              <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1 text-center">
                Minutos
              </label>
              <div class="relative">
                <select
                  v-model="tempSelectedMinute"
                  class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-xs sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 sm:p-2.5 appearance-none cursor-pointer text-center"
                >
                  <option
                    v-for="minute in minutes"
                    :key="minute"
                    :value="minute"
                  >
                    {{ minute.toString().padStart(2, '0') }}
                  </option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <i class="fas fa-chevron-down text-gray-400 text-xs" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pie del calendario -->
        <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <PButton
            size="small"
            type="soft"
            color="info"
            class="w-full sm:w-auto"
            @click="selectToday"
          >
            Hoy
          </PButton>
          <div class="flex flex-col sm:flex-row gap-2 sm:gap-1">
            <PButton
              size="small"
              type="outline"
              color="danger"
              class="w-full sm:w-auto"
              @click="cancelSelection"
            >
              Cancelar
            </PButton>
            <PButton
              size="small"
              class="w-full sm:w-auto"
              @click="confirmSelection"
            >
              Seleccionar
            </PButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { onClickOutside } from '@vueuse/core'
import PButton from "@/components/lib/forms/PButton.vue";
import {useDayjs} from "@/composables/useDayjs.ts";

const model = defineModel({
  type: Date,
  default: null
})

// Props con defineProps
const props = defineProps({
  label: {
    type: String,
    default: 'Seleccionar fecha y hora'
  },
  placeholder: {
    type: String,
    default: 'Selecciona fecha y hora'
  },
  showTime: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: () => new Date()
  },
  inputId: {
    type: String,
    default: 'date-input'
  }
})
const { parseDate } = useDayjs()

const showCalendar = ref(false)
const currentMonth = ref(props.startDate.getMonth())
const currentYear = ref(props.startDate.getFullYear())

// Referencia al contenedor del calendario para detectar clics externos
const calendarContainer = ref(null)

// Estado temporal para las selecciones no confirmadas
const tempSelectedDate = ref(null)
const tempSelectedHour = ref(props.startDate.getHours())
const tempSelectedMinute = ref(Math.floor(props.startDate.getMinutes() / 5) * 5)

// Estado original para restaurar al cancelar
const originalDate = ref(null)

// Constantes
const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const weekDays = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do']

const hours = Array.from({ length: 24 }, (_, i) => i)
const minutes = Array.from({ length: 12 }, (_, i) => i * 5)

// Computed
const formattedDateTime = computed(() => {
  if (!model.value) return ''

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  if (props.showTime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
    options.hour12 = false
  }

  const formatted = model.value.toLocaleString('es-ES', options)
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
})

const firstDayOfMonth = computed(() =>
  new Date(currentYear.value, currentMonth.value, 1)
)

const lastDayOfMonth = computed(() =>
  new Date(currentYear.value, currentMonth.value + 1, 0)
)

const daysInMonth = computed(() =>
  lastDayOfMonth.value.getDate()
)

const emptyDays = computed(() => {
  let startingDay = firstDayOfMonth.value.getDay() - 1
  if (startingDay < 0) startingDay = 6
  return startingDay
})

// Métodos
const toggleCalendar = () => {
  if (!showCalendar.value) {
    // Al abrir el calendario, guardar el estado original
    originalDate.value = model.value ? new Date(model.value) : null
    initializeTempState()
  }
  showCalendar.value = !showCalendar.value
}

const navigateMonth = (direction) => {
  currentMonth.value += direction
  if (currentMonth.value < 0) {
    currentMonth.value = 11
    currentYear.value--
  } else if (currentMonth.value > 11) {
    currentMonth.value = 0
    currentYear.value++
  }
}

const navigateYear = (direction) => {
  currentYear.value += direction
}

const selectDay = (day) => {
  tempSelectedDate.value = new Date(currentYear.value, currentMonth.value, day)
}

const selectToday = () => {
  const today = new Date()
  currentMonth.value = today.getMonth()
  currentYear.value = today.getFullYear()
  tempSelectedHour.value = today.getHours()
  tempSelectedMinute.value = Math.floor(today.getMinutes() / 5) * 5
  tempSelectedDate.value = new Date(today)
}

const confirmSelection = () => {
  if (tempSelectedDate.value) {
    let finalDate

    if (props.showTime) {
      // Con hora: crear fecha con la hora seleccionada
      finalDate = parseDate(tempSelectedDate.value)
        .hour(tempSelectedHour.value)
        .minute(tempSelectedMinute.value)
        .second(0)
        .millisecond(0)
        .toDate()
    } else {
      // Sin hora: establecer medianoche en la zona horaria local
      // para evitar problemas de interpretación
      finalDate = parseDate(tempSelectedDate.value)
        .startOf('day')
        .toDate()
    }

    model.value = finalDate
  }
  showCalendar.value = false
}

const cancelSelection = () => {
  // Restaurar el estado original
  if (originalDate.value) {
    model.value = new Date(originalDate.value)
  }
  showCalendar.value = false
}

const getDayClasses = (day) => {
  const today = new Date()
  const isToday =
    day === today.getDate() &&
    currentMonth.value === today.getMonth() &&
    currentYear.value === today.getFullYear()

  const isSelected = tempSelectedDate.value &&
    day === tempSelectedDate.value.getDate() &&
    currentMonth.value === tempSelectedDate.value.getMonth() &&
    currentYear.value === tempSelectedDate.value.getFullYear()

  if (isSelected) {
    return 'bg-brand-500 text-white shadow-md'
  } else if (isToday) {
    return 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
  }
  return 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
}

const initializeTempState = () => {
  if (model.value) {
    const date = parseDate(model.value)
    currentMonth.value = date.month()
    currentYear.value = date.year()

    if (props.showTime) {
      tempSelectedHour.value = date.hour()
      tempSelectedMinute.value = Math.floor(date.minute() / 5) * 5
    }

    tempSelectedDate.value = date.toDate()
  } else {
    const date = parseDate(props.startDate)
    currentMonth.value = date.month()
    currentYear.value = date.year()

    if (props.showTime) {
      tempSelectedHour.value = date.hour()
      tempSelectedMinute.value = Math.floor(date.minute() / 5) * 5
    }

    tempSelectedDate.value = null
  }
}


// Cerrar el calendario al hacer clic fuera
onClickOutside(calendarContainer, () => {
  if (showCalendar.value) {
    showCalendar.value = false
  }
})

onMounted(() => {
  // Inicializar con la fecha de inicio si no hay valor
  if (!model.value && props.startDate) {
    let initialDate = parseDate(props.startDate)

    if (!props.showTime) {
      initialDate = initialDate.startOf('day')
    }

    model.value = initialDate.toDate()
  }
})
</script>
