<template>
  <div
    id="adminPage"
    class="box"
  >
    <PTitle
      class="mb-5"
      name="Administración de PrognoSports"
    />

    <div class="flex flex-wrap justify-between -mx-2 mb-8">
      <article class="w-full md:w-1/2 p-4">
        <router-link
          to="/admin/users"
          class="py-4 flex items-center justify-center bg-cyan-300 rounded-lg shadow-lg text-black font-bold"
        >
          Administración de Usuarios
        </router-link>
      </article>
      <article class="w-full md:w-1/2 p-4">
        <router-link
          to="/admin/communities"
          class="py-4 flex items-center justify-center bg-yellow-200 rounded-lg shadow-lg text-black font-bold"
        >
          Administración de Comunidades
        </router-link>
      </article>

      <article class="w-full md:w-1/2 p-4">
        <router-link
          to="/admin/competitions"
          class="py-4 flex items-center justify-center bg-red-500 rounded-lg shadow-lg text-black font-bold"
        >
          Administración de Competiciones
        </router-link>
      </article>

      <article class="w-full md:w-1/2 p-4">
        <router-link
          to="/admin/seasons"
          class="py-4 flex items-center justify-center bg-orange-300 rounded-lg shadow-lg text-black font-bold"
        >
          Administración de Temporadas
        </router-link>
      </article>

      <article class="w-full md:w-1/3 p-4">
        <router-link
          to="/admin/gps"
          class="py-4 flex items-center justify-center bg-blue-600 rounded-lg shadow-lg text-black font-bold"
        >
          Administración de Grandes Premios
        </router-link>
      </article>

      <article class="w-full md:w-1/3 p-4">
        <router-link
          to="/admin/sessions"
          class="py-4 flex items-center justify-center bg-indigo-400 rounded-lg shadow-lg text-black font-bold"
        >
          Administración de Sesiones
        </router-link>
      </article>


      <article class="w-full md:w-1/3 p-4">
        <router-link
          to="/admin/circuits"
          class="py-4 flex items-center justify-center bg-violet-500 rounded-lg shadow-lg text-black font-bold"
        >
          Administración de Circuitos
        </router-link>
      </article>

      <article class="w-full md:w-1/2 p-4">
        <router-link
          to="/admin/drivers"
          class="py-4 flex items-center justify-center bg-lime-500 rounded-lg shadow-lg text-black font-bold"
        >
          Administración de Pilotos
        </router-link>
      </article>

      <article class="w-full md:w-1/2 p-4">
        <router-link
          to="/admin/constructors"
          class="py-4 flex items-center justify-center bg-amber-700 rounded-lg shadow-lg text-black font-bold"
        >
          Administración de Constructores
        </router-link>
      </article>

      <article class="w-full md:w-1/2 p-4">
        <router-link
          to="/admin/stats"
          class="py-4 flex items-center justify-center bg-pink-400 rounded-lg shadow-lg text-black font-bold"
        >
          Estadísticas
        </router-link>
      </article>

      <article class="w-full md:w-1/2 p-4">
        <router-link
          to="/admin/logs"
          class="py-4 flex items-center justify-center bg-pink-400 rounded-lg shadow-lg text-black font-bold"
        >
          Logs
        </router-link>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
</script>