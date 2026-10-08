<template>
  <PContainer
    size="xl"
    class="py-6"
  >
    <PCard>
      <PTitle name="Contacto" />
      <PProse>
        <p>Si así se desea, el usuario podrá contactar con los propietarios y administración de la plataforma mediante correo electrónico a través de la dirección <a href="mailto:info@prognosports.com">info@prognosports.com</a></p>

        <PTitle
          tag="h2"
          type="subtitle"
          class="my-2"
        >
          Redes Sociales
        </PTitle>
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
      </PProse>
    </PCard>
  </PContainer>
</template>

<script setup lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import PCard from "@/components/lib/PCard.vue";
import PContainer from "@/components/lib/PContainer.vue";
import PProse from "@/components/lib/PProse.vue";
</script>
