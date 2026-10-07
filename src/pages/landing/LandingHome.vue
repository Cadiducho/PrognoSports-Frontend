<template>
  <div>
    <header
      class="bg-gray-700 bg-cover bg-center bg-no-repeat px-4 py-24 text-center font-semibold text-gray-100 md:py-48"
      style="background-image: url('/spa-portada.jpg')"
    >
      <h1 class="text-3xl leading-snug md:text-5xl md:leading-snug">
        <span class="box-decoration-clone bg-black/45 px-1">
          Pronostica resultados de carreras<br> con tus amigos y compite por ser el mejor
        </span>
      </h1>
    </header>

    <PContainer
      tag="section"
      size="2xl"
      class="grid grid-cols-1 gap-8 py-12 text-center md:grid-cols-3 md:py-16"
    >
      <article
        v-for="feature in features"
        :key="feature.title"
        class="group mx-auto max-w-xs"
      >
        <div class="flex h-28 items-center justify-center">
          <i class="material-icons text-7xl text-brand-500 transition-all group-hover:text-8xl">{{ feature.icon }}</i>
        </div>
        <PTitle
          tag="h2"
          type="subtitle"
        >
          {{ feature.title }}
        </PTitle>
        <p class="text-gray-600 dark:text-gray-300">
          {{ feature.text }}
        </p>
      </article>
    </PContainer>

    <section
      v-for="(highlight, index) in highlights"
      :key="highlight.title"
      class="bg-white even:bg-gray-50 dark:bg-gray-900 dark:even:bg-gray-800/50"
    >
      <PContainer
        size="2xl"
        class="grid grid-cols-1 items-center gap-8 py-12 md:grid-cols-2 md:gap-12 md:py-16"
      >
        <div :class="{ 'md:order-2': index % 2 === 1 }">
          <PTitle
            tag="h2"
            type="title"
          >
            {{ highlight.title }}
          </PTitle>
          <p class="text-lg text-gray-600 dark:text-gray-300">
            {{ highlight.text }}
          </p>
        </div>
        <img
          class="w-full rounded-lg shadow-lg ring-1 ring-black/5 dark:ring-white/10"
          :src="highlight.image"
          alt=""
          loading="lazy"
        >
      </PContainer>
    </section>

    <section class="bg-brand-accent-600 px-4 py-10 dark:bg-brand-accent-800">
      <PContainer
        size="md"
        class="flex flex-col items-center justify-center gap-6 text-center text-white md:flex-row md:text-left"
      >
        <div>
          <h2 class="text-3xl font-semibold">
            ¿Preparado para comenzar?
          </h2>
          <p class="text-lg">
            ¡Regístrate y prúebalo gratis!
          </p>
        </div>
        <PButton
          class="shrink-0 !bg-white !text-brand-accent-700 hover:!bg-gray-100"
          pilled
          size="large"
          @click="sendToRegister"
        >
          Registrarse
        </PButton>
      </PContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import PTitle from "@/components/lib/PTitle.vue";
import PContainer from "@/components/lib/PContainer.vue";
import PButton from "@/components/lib/forms/PButton.vue";

const router = useRouter();
const sendToRegister = () => {
    window.scrollTo({top: 0, left: 0, behavior: "smooth"});

    router.push({path: '/register'});
};

const features = [
  {
    icon: 'people',
    title: 'Comunitario',
    text: 'Crea una comunidad con tus amigos o únete a una ya existente. Podrás participar en distintas comunidades con diferentes pronósticos y reglas.'
  },
  {
    icon: 'favorite_border',
    title: 'Intuitivo',
    text: 'PrognoSports está diseñado para ser intuitivo con las competiciones de motor. Escoge el orden de los pilotos en las distintas sesiones y obtén más puntos que tus rivales.'
  },
  {
    icon: 'important_devices',
    title: 'Versátil',
    text: 'Realiza tus pronósticos desde el PC, móvil o tablet sin ninguna limitación.'
  }
];

const highlights = [
  {
    title: 'Dedicado',
    text: 'Con un diseño orientado a competiciones de Fórmula 1™, en una misma página podrás ver todos los datos útiles para tus pronósticos.',
    image: 'https://prognosports.com/dist/img/landing/dedicado.png'
  },
  {
    title: 'Visual',
    text: 'Podrás comprobar tus resultados y compararlos con tus rivales mediante sencillas gráficas de puntos, o detalladas tablas de valores.',
    image: 'https://prognosports.com/dist/img/landing/visual.png'
  },
  {
    title: 'A medida',
    text: 'Personaliza cómo quieres visualizar ciertas secciones de la web o qué notificaciones quieres recibir y a dónde. Podrás personalizar PrognoSports a medida.',
    image: 'https://prognosports.com/dist/img/landing/personalizable.png'
  }
];
</script>
