<template>
  <div
    id="adminDrivers"
    class="box"
  >
    <loading v-if="isLoadingGrandPrix" />
    <template v-else>
      <PTitle :name="'Administración de ' + grandPrix.name" />

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


      <p v-if="!thereIsGrandPrix">
        El Gran Premio {{ id }} no ha sido encontrado
      </p>
      <template v-else>
        <div class="columns">
          <div class="column">
            <h2 class="title">
              Datos del {{ grandPrix.name }}
            </h2>

            <o-field label="Nombre">
              <o-input
                v-model="grandPrix.name"
                name="name"
                expanded
                lazy
              />
            </o-field>


            <o-field label="Código del Gran Premio">
              <o-input
                v-model="grandPrix.code"
                name="code"
                expanded
                lazy
              />
            </o-field>


            <hr>
            <PButton
              :disabled="!isDataOk()"
              label="Editar Gran Premio"
              color="primary"
              @click="editGrandPrix()"
            />
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import {grandPrixService, notificationService} from "@/_services";
import {GrandPrix} from "@/types/GrandPrix";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import PButton from "@/components/lib/forms/PButton.vue";

export default defineComponent({
    name: "EditGrandPrix",
    components: {
      PButton,
        PTitle,
    },
    setup() {
        const authStore = useAuthStore();
        const currentUser = authStore.loggedUser;
        return {currentUser};
    },
    data() {
        return {
            id: this.$route.params.gp,

            grandPrix: {} as GrandPrix,
            thereIsGrandPrix: false,
            isLoadingGrandPrix: true,
        }
    },
    mounted() {
        grandPrixService.getGrandPrix(this.id)
            .then(gp => {
                this.grandPrix = gp;
                this.thereIsGrandPrix = true;
            }).finally(() => {
                this.isLoadingGrandPrix = false;
            }
        );
    },
    methods: {
        isDataOk(): boolean {
            return !(this.grandPrix.code.trim() === ""
                && this.grandPrix.name.trim() === ""
            )
        },
        editGrandPrix(): void {
            let data = {
                id: this.grandPrix!.id,
                name: this.grandPrix!.name,
                code: this.grandPrix!.code,
            };

            grandPrixService.editGrandPrix(data).then((result) => {
              notificationService.showNotification("Se ha editado correctamente el gran premio `" + result.name + "`", "error");

              this.$router.push({
                name: 'adminGps'
              })
            }).catch((error) => {
                notificationService.showNotification(error.message, "error");
            });
        },
    }
});
</script>
