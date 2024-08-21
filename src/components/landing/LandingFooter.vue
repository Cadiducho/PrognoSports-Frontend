<template>
  <div class="flex min-h-[60vh] bg-neutral-100 dark:bg-gray-900">
    <footer class="m-0 p-20 pt-14 flex-1 text-center">
      <div class="flex mb-4 lg:flex-row flex-col">
        <div class="flex-1 p-4 basis-0 md:mr-80">
          <router-link to="/">
            <img
              src="@/assets/logo.png"
              class="image is-128x128"
              alt="Logo PrognoSports"
            >
          </router-link>
        </div>
        <div class="flex-1 p-4 basis-0">
          <div class="mb-3 text-left font-bold text-stone-500 dark:text-gray-200">
            PrognoSports
          </div>
          <ul class="flex flex-col items-start list-none">
            <li>
              <router-link
                to="/faq"
                class="list-item"
              >
                FAQ
              </router-link>
            </li>
            <li>
              <a
                href="https://api.prognosports.com/swagger"
                class="list-item"
              >Documentación</a>
            </li>
            <li>
              <a
                href="https://github.com/Cadiducho/PrognoSports-Frontend"
                class="list-item"
              >Github</a>
            </li>
          </ul>
        </div>
        <div class="flex-1 p-4 basis-0">
          <div class="mb-3 text-left font-bold text-stone-500 dark:text-gray-200">
            Conecta
          </div>
          <ul class="flex flex-col items-start list-none">
            <li>
              <router-link
                to="/contact"
                class="list-item"
              >
                <i class="fas fa-envelope px-1" /> Contacta con el equipo
              </router-link>
            </li>
            <li>
              <a
                href="https://twitter.com/PrognoSports"
                class="list-item"
              >
                <i class="fab fa-twitter px-1" /> Twitter
              </a>
            </li>
            <li>
              <a
                href="https://telegram.me/PrognoSportsInfo"
                class="list-item"
              >
                <i class="fab fa-telegram px-1" /> Telegram
              </a>
            </li>
            <li>
              <a
                href="https://twitch.tv/PrognoSports"
                class="list-item"
              >
                <i class="fab fa-twitch px-1" /> Twitch
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/PrognoSports"
                class="list-item"
              >
                <i class="fab fa-instagram px-1" /> Instagram
              </a>
            </li>
          </ul>
        </div>
        <div class="flex-1 p-4 basis-0">
          <div class="mb-3 text-left font-bold text-stone-500 dark:text-gray-200">
            Legal
          </div>
          <ul class="flex flex-col items-start list-none">
            <li>
              <router-link
                to="/terms"
                class="list-item"
              >
                Términos de servicio
              </router-link>
            </li>
            <li>
              <router-link
                to="/privacy"
                class="list-item"
              >
                Política de privacidad
              </router-link>
            </li>
            <li>
              <router-link
                to="/rules"
                class="list-item"
              >
                Normativa
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <small class="block text-xs text-gray-500 dark:text-gray-300">© {{ new Date().getFullYear() }} PrognoSports.com. Todos los derechos reservados</small>
      <small class="block text-xs text-gray-500 dark:text-gray-300">Versión <a :href="`https://github.com/Cadiducho/PrognoSports-Frontend/commit/${commitHash}`">{{ humanVersion }}</a> - Compilado el {{ humanDateTime(commitDate) }}</small>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useDayjs} from "@/composables/useDayjs";

const branchName = import.meta.env.VITE_GIT_BRANCH_NAME;
const commitHash = import.meta.env.VITE_GIT_COMMIT_HASH;
const commitDate = import.meta.env.VITE_GIT_COMMIT_DATE;

const humanVersion = ref('');
if (branchName === "master") {
    humanVersion.value = "estable";
} else {
    humanVersion.value = branchName
}
humanVersion.value += "/" + commitHash;

const dayjs = useDayjs();
const humanDateTime = dayjs.humanDateTime;
</script>

<style scoped>
.list-item {
    @apply text-stone-500 dark:text-gray-200 hover:text-stone-600 dark:hover:text-gray-300 text-left font-normal leading-6 no-underline
}
</style>