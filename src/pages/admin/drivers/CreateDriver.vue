<template>
  <div
    id="createDriver"
    class="box"
  >
    <PTitle
      class="mb-5"
      name="Crear piloto"
    />

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

    <o-steps v-model="activeStep">
      <o-step-item
        step="1"
        label="Datos del piloto"
      >
        <h2 class="title">
          Datos del piloto
        </h2>

        <o-field label="ID del piloto">
          <o-input
            v-model="createdDriver.id"
            name="id"
            expanded
            lazy
          />
        </o-field>

        <o-field label="Nombre del piloto">
          <o-input
            v-model="createdDriver.firstname"
            name="firstname"
            expanded
            lazy
          />
        </o-field>

        <o-field label="Apellido del piloto">
          <o-input
            v-model="createdDriver.lastname"
            name="lastname"
            expanded
            lazy
          />
        </o-field>

        <o-field label="Código del piloto">
          <o-input
            v-model="createdDriver.code"
            name="code"
            expanded
            lazy
          />
        </o-field>

        <o-field label="Nacionalidad del piloto">
          <o-input
            v-model="createdDriver.nationality"
            name="nationality"
            expanded
            lazy
          />
        </o-field>

        <o-field label="Fecha de nacimiento">
          <o-datepicker
            v-model="createdDriver.birth"
            placeholder="Click para escoger..."
            icon="calendar"
            trap-focus
          />
        </o-field>

        <hr>
      </o-step-item>

      <o-step-item
        step="2"
        label="Finalizar"
      >
        <h2 class="title">
          Finalizar
        </h2>

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

        <div class="notification has-background-primary">
          Revisa los datos, se va a crear el siguiente piloto
        </div>

        <div class="content">
          <p class="card-text">
            <b>ID del piloto: </b>{{ createdDriver.id }}
          </p>
          <p class="card-text">
            <b>Nombre del piloto: </b>{{ createdDriver.firstname }} {{ createdDriver.lastname }}
          </p>
          <p class="card-text">
            <b>Código del piloto: </b>{{ createdDriver.code }}
          </p>
          <p class="card-text">
            <b>Nacionalidad del piloto: </b>{{ createdDriver.nationality }}
          </p>
          <p class="card-text">
            <b>Fecha de nacimiento: </b>{{ humanDate(createdDriver.birth) }}
          </p>
        </div>

        <hr>
        <PButton
          :disabled="!isDataOk()"
          label="Crear piloto"
          color="primary"
          @click="registerDriver()"
        />
      </o-step-item>
    </o-steps>
  </div>
</template>

<script lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import {driversService, notificationService} from "@/_services";
import AlertInvalidData from "@/components/lib/AlertInvalidData.vue";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import {Driver} from "@/types/Driver";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import {useDayjs} from "@/composables/useDayjs";
import PButton from "@/components/lib/forms/PButton.vue";

export default defineComponent({
    name: "CreateDriver",
    components: {
      PButton,
        AlertNoPermission,
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
