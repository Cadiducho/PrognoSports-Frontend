<template>
  <section class="flex flex-col gap-4">
    <PTitle
      tag="h2"
      type="subtitle"
      no-margin
    >
      Temporadas
    </PTitle>

    <Loading v-if="isLoading" />
    <PrognoAlert
      v-else-if="loadError"
      variant="danger"
    >
      {{ loadError }}
    </PrognoAlert>
    <template v-else>
      <p
        v-if="!memberships.length"
        class="text-sm text-gray-500 dark:text-gray-400"
      >
        Todavía no está enlazado a ninguna temporada.
      </p>
      <ul
        v-else
        class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
      >
        <li
          v-for="membership in memberships"
          :key="membership.season.id"
          class="flex items-start justify-between gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
        >
          <div class="min-w-0">
            <p class="font-semibold text-gray-800 dark:text-gray-100">
              {{ membership.season.name }}
              <span class="text-sm font-normal text-gray-500 dark:text-gray-400">· {{ membership.season.competition?.name }}</span>
            </p>
            <p
              v-if="membership.error"
              class="text-sm text-warning-700 dark:text-warning-400"
            >
              <i
                class="fa fa-triangle-exclamation"
                aria-hidden="true"
              />
              No se han podido cargar sus datos en esta temporada: {{ membership.error }}
            </p>
            <div
              v-else-if="membership.entry !== undefined"
              class="text-sm text-gray-600 dark:text-gray-300"
            >
              <slot
                name="entry"
                :season="membership.season"
                :entry="membership.entry"
              />
            </div>
          </div>
          <div class="flex shrink-0 gap-1">
            <PButton
              v-if="editRoute"
              tag="router-link"
              :to="editRoute(membership.season)"
              type="ghost"
              color="info"
              size="small"
              icon="fa fa-pen"
              :aria-label="`Editar en ${membership.season.name}`"
            />
            <PButton
              v-if="unlink"
              type="ghost"
              color="danger"
              size="small"
              icon="fa fa-link-slash"
              :aria-label="`Quitar de ${membership.season.name}`"
              @click="seasonToUnlink = membership.season"
            />
          </div>
        </li>
      </ul>

      <PDivider />

      <PTitle
        tag="h3"
        type="subtitle"
        no-margin
      >
        Añadir a otras temporadas
      </PTitle>
      <SeasonLinker
        :key="linkerKey"
        :linked-season-ids="linkedSeasonIds"
        :create-model="createModel"
        :is-valid="isValid"
        :submit="submit"
        @linked="onLinked"
      >
        <template #fields="slotProps">
          <slot
            name="fields"
            v-bind="slotProps"
          />
        </template>
      </SeasonLinker>
    </template>

    <PrognoModal
      :model-value="!!seasonToUnlink"
      @update:model-value="seasonToUnlink = undefined"
      @handle="confirmUnlink"
    >
      <template #title>
        ¿Quitar de la temporada?
      </template>
      <template #content>
        Se quitará de la temporada <span class="font-semibold">{{ seasonToUnlink?.name }}</span>.
      </template>
      <template #saveText>
        Quitar
      </template>
    </PrognoModal>
  </section>
</template>

<script setup lang="ts" generic="T extends object, E">
import {computed, onMounted, ref, Ref} from "vue";
import {RouteLocationRaw} from "vue-router";
import {Season} from "@/types/Season";
import {SeasonMembership} from "@/_services/seasonMembership";
import {notificationService} from "@/_services";
import {errorMessage} from "@/composables/errorMessage";
import SeasonLinker from "@/components/admin/seasons/SeasonLinker.vue";
import PTitle from "@/components/lib/PTitle.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PDivider from "@/components/lib/PDivider.vue";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import PrognoModal from "@/components/lib/PrognoModal.vue";
import Loading from "@/components/lib/Loading.vue";

/**
 * Sección de las páginas de edición de una entidad que muestra sus temporadas y permite enlazarla a más.
 */
const props = withDefaults(defineProps<{
  /** Carga las temporadas en las que está la entidad */
  load: () => Promise<Array<SeasonMembership<E>>>;
  createModel: (season: Season) => T;
  isValid: (model: T, season: Season) => boolean;
  submit: (season: Season, model: T) => Promise<unknown>;
  /** Ruta para editar los datos de la entidad en esa temporada */
  editRoute?: (season: Season) => RouteLocationRaw;
  /** Quita la entidad de la temporada */
  unlink?: (season: Season) => Promise<unknown>;
}>(), {
  editRoute: undefined,
  unlink: undefined,
});

defineSlots<{
  entry?(props: { season: Season; entry: E }): unknown;
  fields(props: { season: Season; model: T; update: (model: T) => void }): unknown;
}>();

const isLoading = ref(true);
const loadError = ref<string>();
const memberships = ref([]) as Ref<Array<SeasonMembership<E>>>;
const seasonToUnlink = ref<Season>();
const linkerKey = ref(0);

const linkedSeasonIds = computed(() => memberships.value.map(membership => membership.season.id));

const reload = async () => {
  try {
    memberships.value = (await props.load()).sort((a, b) => b.season.id - a.season.id);
    loadError.value = undefined;
  } catch (e) {
    loadError.value = errorMessage(e) ?? "No se han podido cargar las temporadas";
  } finally {
    isLoading.value = false;
  }
};

onMounted(reload);

const onLinked = () => {
  reload();
};

const confirmUnlink = async () => {
  const season = seasonToUnlink.value;
  seasonToUnlink.value = undefined;
  const membership = memberships.value.find(m => m.season.id === season?.id);
  if (!season || !membership || !props.unlink) return;
  try {
    await props.unlink(season);
    notificationService.showNotification(`Quitado de la temporada ${season.name}`);
    await reload();
    // Reinicia el enlazador para que la temporada vuelva a estar disponible
    linkerKey.value++;
  } catch (e) {
    notificationService.showNotification(errorMessage(e) ?? "No se ha podido quitar de la temporada", "error");
  }
};
</script>
