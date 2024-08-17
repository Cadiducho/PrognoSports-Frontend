<template>
  <div class="container mt-6 mb-6">
    <PTitle name="Contacto" />
    <section class="dark:text-gray-200">
      <p>Si así se desea, el usuario podrá contactar con los propietarios y administración de la plataforma mediante correo electrónico a través de la dirección <a href="mailto:info@prognosports.com">info@prognosports.com</a></p>

      <h2 class="subtitle my-2 dark:text-gray-200">
        Redes Sociales
      </h2>
      <p>Mantente en contacto con <b>PrognoSports</b> a través de sus redes sociales:</p>
      <ul>
        <li>
          <router-link to="/contact">
            <i class="fas fa-envelope px-1" /> Contacta con el equipo
          </router-link>
        </li>
        <li>
          <a href="https://twitter.com/PrognoSports">
            <i class="fab fa-twitter px-1" /> Twitter
          </a>
        </li>
        <li>
          <a href="https://telegram.me/PrognoSportsInfo">
            <i class="fab fa-telegram px-1" /> Telegram
          </a>
        </li>
        <li>
          <a href="https://twitch.tv/PrognoSports">
            <i class="fab fa-twitch px-1" /> Twitch
          </a>
        </li>
        <li>
          <a href="https://instagram.com/PrognoSports">
            <i class="fab fa-instagram px-1" /> Instagram
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>
<script setup lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
</script>