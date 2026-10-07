<template>
  <PCard tag="div" id="createGrandPrix">
    <PTitle
      class="mb-5"
      name="Crear gran premio"
    />

    <nav class="block">
      <PButton
        color="info"
        :to="{name: 'adminGps'}"
        tag="router-link"
        icon="fa fa-chevron-left"
      >
        Volver a Grandes Premios
      </PButton>
    </nav>

    <PStepper v-model="activeStep" :steps="[{ label: 'Datos del gran premio' }, { label: 'Finalizar' }]">
      <template #step-0>
        <PTitle tag="h2" type="title">
          Datos del gran premio
        </PTitle>

        <PField label="Nombre del Gran Premio">
          <PInput
            v-model="createdGrandPrix.name"
            name="name"
            expanded
            lazy
          />
        </PField>

        <PField label="Código del Gran Premio">
          <PInput
            v-model="createdGrandPrix.code"
            name="code"
            expanded
            lazy
          />
        </PField>
      </template>

      <template #step-1>
        <PTitle tag="h2" type="title">
          Finalizar
        </PTitle>

        <AlertInvalidData
          :object="createdGrandPrix.name"
          message="No has introducido nombre para este gran premio"
        />
        <AlertInvalidData
          :object="createdGrandPrix.code"
          message="No has introducido código para este gran premio"
        />

        <PrognoAlert
          v-if="isDataOk()"
          variant="warning"
        >
          Revisa los datos, se va a crear el Gran Premio
        </PrognoAlert>

        <PProse>
          <p>
            <b>Nombre del Gran Premio: </b>{{ createdGrandPrix.name }}
          </p>
          <p>
            <b>Código del Gran Premio: </b>{{ createdGrandPrix.code }}
          </p>
        </PProse>

        <PDivider />
        <PButton
          :disabled="!isDataOk()"
          label="Crear Gran Premio"
          color="primary"
          @click="registerGrandPrix()"
        />
      </template>
    </PStepper>
  </PCard>
</template>

<script lang="ts">
import PTitle from "@/components/lib/PTitle.vue"
import {circuitService, grandPrixService, notificationService, seasonService} from "@/_services";
import AlertInvalidData from "@/components/lib/AlertInvalidData.vue";
import {GrandPrix} from "@/types/GrandPrix";
import {Season} from "@/types/Season";
import {Circuit} from "@/types/Circuit";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import PButton from "@/components/lib/forms/PButton.vue";
import PField from "@/components/lib/forms/PField.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import PStepper from "@/components/lib/PStepper.vue";
import PProse from "@/components/lib/PProse.vue";
import PDivider from "@/components/lib/PDivider.vue";
import PCard from "@/components/lib/PCard.vue";

export default defineComponent({
    name: "CreateGrandPrix",
    components: {
    PCard,
    PProse,
    PDivider,
      PrognoAlert,
      PStepper,
      PInput,
      PField,
      PButton,
        AlertInvalidData,
        PTitle,
    },
    setup() {
        const authStore = useAuthStore();

        const currentUser = authStore.loggedUser;
        return { currentUser };
    },
    data() {
        return {
            activeStep: 0,

            createdGrandPrix: {
                code: "",
                name: "",
            } as GrandPrix
        }
    },
    mounted() {
    },
    methods: {
        isDataOk(): boolean {
            return !(this.createdGrandPrix.code.trim() === ""
                && this.createdGrandPrix.name.trim() === ""
            )
        },
        registerGrandPrix(): void {
            let data = {
                name: this.createdGrandPrix.name,
                code: this.createdGrandPrix.code,
            }

            grandPrixService.createGrandPrix(data).then((result) => {
                notificationService.showNotification("Se ha registrado correctamente el Gran Premio `" + result.name + "`", "success");

                this.$router.push({
                    name: 'adminGps'
                })
            }).catch((error) => {
                notificationService.showNotification(error.message, "error");
            });
        }
    }
});
</script>
