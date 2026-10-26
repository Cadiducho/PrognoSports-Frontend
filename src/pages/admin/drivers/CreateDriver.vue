<template>
  <PPage>
    <nav class="block">
      <PButton
        color="info"
        to="/admin/drivers"
        tag="router-link"
        icon="fa fa-chevron-left"
      >
        Volver a Lista de pilotos
      </PButton>
    </nav>

    <PStepper
      v-model="activeStep"
      :steps="[{ label: 'Datos del piloto' }, { label: 'Finalizar' }]"
    >
      <template #step-0>
        <PTitle
          tag="h2"
          type="title"
        >
          Datos del piloto
        </PTitle>

        <PField label="Nombre del piloto">
          <PInput
            v-model="createdDriver.firstname"
            name="firstname"
          />
        </PField>

        <PField label="Apellido del piloto">
          <PInput
            v-model="createdDriver.lastname"
            name="lastname"
          />
        </PField>

        <PField label="Código del piloto">
          <PInput
            v-model="createdDriver.code"
            name="code"
          />
        </PField>

        <PField label="Nacionalidad del piloto">
          <PInput
            v-model="createdDriver.nationality"
            name="nationality"
          />
        </PField>

        <PField label="Fecha de nacimiento">
          <CalendarDateTimePicker
            v-model="createdDriver.birth"
            placeholder="Click para escoger..."
            :show-time="false"
          />
        </PField>

        <PDivider />
      </template>

      <template #step-1>
        <PTitle
          tag="h2"
          type="title"
        >
          Finalizar
        </PTitle>

        <AlertInvalidData
          :object="createdDriver.id"
          message="No has introducido ID para este piloto"
        />
        <AlertInvalidData
          :object="createdDriver.firstname"
          message="No has introducido nombre para este piloto"
        />
        <AlertInvalidData
          :object="createdDriver.lastname"
          message="No has introducido apellido para este piloto"
        />
        <AlertInvalidData
          :object="createdDriver.code"
          message="No has introducido código para este piloto"
        />
        <AlertInvalidData
          :object="createdDriver.nationality"
          message="No has introducido nacionalidad para este piloto"
        />

        <PrognoAlert variant="warning">
          Revisa los datos, se va a crear el siguiente piloto
        </PrognoAlert>

        <PProse>
          <p>
            <b>ID del piloto: </b>{{ createdDriver.id }}
          </p>
          <p>
            <b>Nombre del piloto: </b>{{ createdDriver.firstname }} {{ createdDriver.lastname }}
          </p>
          <p>
            <b>Código del piloto: </b>{{ createdDriver.code }}
          </p>
          <p>
            <b>Nacionalidad del piloto: </b>{{ createdDriver.nationality }}
          </p>
          <p>
            <b>Fecha de nacimiento: </b>{{ humanDate(createdDriver.birth) }}
          </p>
        </PProse>

        <PDivider />
        <PButton
          :disabled="!isDataOk()"
          label="Crear piloto"
          color="primary"
          @click="registerDriver()"
        />
      </template>
    </PStepper>
  </PPage>
</template>

<script lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import {driversService, notificationService} from "@/_services";
import AlertInvalidData from "@/components/lib/AlertInvalidData.vue";
import {Driver} from "@/types/Driver";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useDayjs} from "@/composables/useDayjs";
import PButton from "@/components/lib/forms/PButton.vue";
import PField from "@/components/lib/forms/PField.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import PrognoAlert from "@/components/lib/PrognoAlert.vue";
import CalendarDateTimePicker from "@/components/lib/CalendarDateTimePicker.vue";
import PStepper from "@/components/lib/PStepper.vue";
import PProse from "@/components/lib/PProse.vue";
import PDivider from "@/components/lib/PDivider.vue";

export default defineComponent({
    name: "CreateDriver",
    components: {
    PProse,
    PDivider,
      CalendarDateTimePicker,
      PStepper,
      PrognoAlert,
      PInput,
      PField,
      PButton,
      AlertInvalidData,
      PTitle,
    },
    setup() {
        const dayjs = useDayjs();
        const authStore = useAuthStore();

        const humanDate = dayjs.humanDate;
        const currentUser = authStore.loggedUser;
        return { currentUser, humanDate };
    },
    data() {
        return {
            activeStep: 0,
            createdDriver: {
                id: undefined!,
                firstname: undefined!,
                lastname: undefined!,
                code: undefined!,
                nationality: undefined!,
                birth: undefined!,

                color: "",
                number: 0,
                team: undefined!
            } as Driver
        }
    },
    methods: {
        isDataOk(): boolean {
            return !(this.createdDriver.id == undefined && this.createdDriver.firstname == undefined && this.createdDriver.lastname == undefined
                && this.createdDriver.code == undefined && this.createdDriver.nationality == undefined && this.createdDriver.birth == undefined)
        },
        registerDriver(): void {
            let rawDriver = {
                id: this.createdDriver.id,
                firstname: this.createdDriver.firstname,
                lastname: this.createdDriver.lastname,
                code: this.createdDriver.code,
                nationality: this.createdDriver.nationality,
                birth: this.createdDriver.birth,
            }

            driversService.createDriver(rawDriver).then((result) => {
                notificationService.showNotification("Se ha registrado correctamente el piloto `" + result.firstname + " " + result.lastname + "`", "success");

                this.$router.push({
                    name: 'viewDriver',
                    params: {
                        id: result.id
                    }
                })
            }).catch((error) => {
                notificationService.showNotification(error.message, "error");
            });
        }
    }
});
</script>
