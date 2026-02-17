<template>
  <PCard>
    <PTitle
      v-if="season?.name && constructor?.name"
      class="mb-5"
      :name="'Editar Constructor ' + constructor.name + ' en la temporada ' + season.name"
    />

    <nav class="flex justify-between mb-4">
      <p-button
        color="info"
        icon="fa fa-chevron-left"
        :to="{name: 'adminConstructorsInSeason', params: {season: season.id}}"
        tag="router-link"
      >
        Volver a lista de Constructores
      </p-button>
    </nav>

    <div
      v-if="isLoading"
      class="text-center py-8"
    >
      <i class="fas fa-spinner fa-spin text-4xl text-brand-accent-500" />
    </div>

    <form
      v-else
      @submit.prevent="updateConstructor"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Información del constructor (solo lectura) -->
        <PField label="Nombre">
          <PInput
            :model-value="constructor.name"
            disabled
            readonly
          />
        </PField>

        <PField label="ID">
          <PInput
            :model-value="constructor.id.toString()"
            disabled
            readonly
          />
        </PField>

        <!-- Campos editables -->
        <PField
          label="Nombre completo"
          required
        >
          <PInput
            v-model="editedConstructor.fullname"
            type="text"
            required
            placeholder="Red Bull Racing Honda RBPT"
          />
        </PField>

        <PField
          label="Nombre del coche"
          required
        >
          <PInput
            v-model="editedConstructor.car"
            type="text"
            required
            placeholder="RB20"
          />
        </PField>

        <PField
          label="Color del equipo"
          required
        >
          <ColorPicker
            v-model="editedConstructor.teamcolor"
            required
          />
        </PField>
      </div>

      <div class="flex gap-2 mt-6">
        <PButton
          icon="fa fa-save"
          :disabled="!isFormValid || isSaving"
          @click="updateConstructor"
        >
          {{ isSaving ? 'Guardando...' : 'Guardar cambios' }}
        </PButton>

        <PButton
          color="info"
          icon="fa fa-undo"
          @click="resetForm"
        >
          Restablecer
        </PButton>
      </div>
    </form>
  </PCard>
</template>

<script setup lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import PCard from "@/components/lib/PCard.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PField from "@/components/lib/forms/PField.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import ColorPicker from "@/components/lib/forms/ColorPicker.vue";
import { constructorService, seasonService, notificationService } from "@/_services";
import { Season } from "@/types/Season";
import { Constructor } from "@/types/Constructor";
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const season = ref<Season>({} as Season);
const constructor = ref<Constructor>({} as Constructor);
const editedConstructor = ref({
  fullname: '',
  car: '',
  teamcolor: ''
});
const isLoading = ref(true);
const isSaving = ref(false);

const isFormValid = computed(() => {
  const colorRegex = /^#?[0-9A-Fa-f]{6}$/;
  return (
    editedConstructor.value.fullname.trim().length > 0 &&
    editedConstructor.value.car.trim().length > 0 &&
    colorRegex.test(editedConstructor.value.teamcolor)
  );
});

onMounted(async () => {
  try {
    const seasonId = route.params.season as string;
    const constructorId = String(route.params.constructor);

    const [seasonData, constructorsData] = await Promise.all([
      seasonService.getSeason(seasonId),
      constructorService.getConstructorsInSeason({ id: Number(seasonId) } as Season)
    ]);

    season.value = seasonData;
    const foundConstructor = constructorsData.find(c => c.id.toString() === constructorId);

    if (!foundConstructor) {
      notificationService.showNotification("Constructor no encontrado en esta temporada", "error");
      router.push({ name: 'adminConstructorsInSeason', params: { season: seasonId } });
      return;
    }

    constructor.value = foundConstructor;
    editedConstructor.value = {
      fullname: foundConstructor.longname,
      car: foundConstructor.carname,
      teamcolor: foundConstructor.teamcolor.replace('#', '')
    };
  } catch (error) {
    notificationService.showNotification("Error al cargar los datos", "error");
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});

const resetForm = () => {
  editedConstructor.value = {
    fullname: constructor.value.longname,
    car: constructor.value.carname,
    teamcolor: constructor.value.teamcolor.replace('#', '')
  };
};

const updateConstructor = async () => {
  if (!isFormValid.value || isSaving.value) return;

  isSaving.value = true;
  try {
    const seasonId = route.params.season as string;

    await constructorService.updateConstructorInSeason(seasonId, {
      id: constructor.value.id,
      fullname: editedConstructor.value.fullname,
      car: editedConstructor.value.car,
      teamcolor: editedConstructor.value.teamcolor
    });

    notificationService.showNotification(
      `Constructor ${constructor.value.name} actualizado correctamente`,
      "success"
    );

    router.push({ name: 'adminConstructorsInSeason', params: { season: seasonId } });
  } catch (error) {
    notificationService.showNotification("Error al actualizar el constructor", "error");
    console.error(error);
  } finally {
    isSaving.value = false;
  }
};
</script>







