<template>
  <div
    id="createGrandPrix"
    class="box"
  >
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

    <o-steps v-model="activeStep">
      <o-step-item
        step="1"
        label="Datos del gran premio"
      >
        <h2 class="title">
          Datos del gran premio
        </h2>

        <o-field label="Nombre del Gran Premio">
          <o-input
            v-model="createdGrandPrix.name"
            name="name"
            expanded
            lazy
          />
        </o-field>

        <o-field label="Código del Gran Premio">
          <o-input
            v-model="createdGrandPrix.code"
            name="code"
            expanded
            lazy
          />
        </o-field>
      </o-step-item>

      <o-step-item
        step="2"
        label="Finalizar"
      >
        <h2 class="title">
          Finalizar
        </h2>

        <AlertInvalidData
          :object="createdGrandPrix.name"
          message="No has introducido nombre para este gran premio"
        />
        <AlertInvalidData
          :object="createdGrandPrix.code"
          message="No has introducido código para este gran premio"
        />

        <div
          v-if="isDataOk()"
          class="notification has-background-primary"
        >
          Revisa los datos, se va a crear el Gran Premio
        </div>

        <div class="content">
          <p class="card-text">
            <b>Nombre del Gran Premio: </b>{{ createdGrandPrix.name }}
          </p>
          <p class="card-text">
            <b>Código del Gran Premio: </b>{{ createdGrandPrix.code }}
          </p>
        </div>

        <hr>
        <PButton
          :disabled="!isDataOk()"
          label="Crear Gran Premio"
          color="primary"
          @click="registerGrandPrix()"
        />
      </o-step-item>
    </o-steps>
  </div>
</template>

<script lang="ts">
import PTitle from "@/components/lib/PTitle.vue"
import {circuitService, grandPrixService, notificationService, seasonService} from "@/_services";
import AlertInvalidData from "@/components/lib/AlertInvalidData.vue";
import AlertNoPermission from "@/components/lib/AlertNoPermission.vue";
import {GrandPrix} from "@/types/GrandPrix";
import {Season} from "@/types/Season";
import {Circuit} from "@/types/Circuit";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import PButton from "@/components/lib/forms/PButton.vue";

export default defineComponent({
    name: "CreateGrandPrix",
    components: {
      PButton,
        AlertNoPermission,
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
