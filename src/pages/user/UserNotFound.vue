<template>
  <section class="p-12 min-h-[40vh]">
    <div class="flex flex-col justify-center items-center h-full">
      <PTitle>
        Perfil no encontrado
      </PTitle>
      <PTitle type="subtitle">
        Este perfil no existe o no ha sido encontrado. Vuelve a inicio o inténtalo de nuevo.
      </PTitle>

      <section class="flex flex-row justify-center items-center gap-2">
        <PButton
          color="danger"
          type="outline"
          @click="back()"
        >
          Atrás
        </PButton>
        <PButton
          tag="router-link"
          to="/"
        >
          Inicio
        </PButton>
        <PButton
          tag="router-link"
          color="info"
          :to="{name: 'user', params: { user: currentUser.id }}"
        >
          Mi perfil
        </PButton>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import PButton from "@/components/lib/forms/PButton.vue";
import PTitle from "@/components/lib/PTitle.vue";
import {useAuthStore} from "@/store/authStore";
import {useRouter} from "vue-router";

const authStore = useAuthStore();
const currentUser = authStore.loggedUser

const router = useRouter();
const back = () => {
  router.go(-1);
};
</script>

<style scoped lang="scss">

</style>
