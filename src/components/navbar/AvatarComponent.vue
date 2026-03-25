<template>
  <div
    id="avatarComponent"
    ref="dropdownRef"
    class="relative"
  >
    <template v-if="currentUser">
      <button
        type="button"
        class="inline-flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary md:w-auto dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
        :aria-expanded="isOpen"
        @click="isOpen = !isOpen"
      >
        <span class="inline-flex items-center gap-2">
          <img
            class="h-8 w-8 rounded-full object-cover"
            :src="currentUser.profileImage()"
            alt="Profile image"
          >
          <span class="truncate">{{ currentUser.username }}</span>
        </span>
        <i class="fas fa-chevron-down text-xs" />
      </button>

      <div
        v-if="isOpen"
        class="right-0 z-30 mt-2 w-full min-w-56 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg md:absolute md:w-56 dark:border-gray-700 dark:bg-gray-900"
      >
        <p class="truncate px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
          {{ currentUser.email }}
        </p>
        <div class="border-t border-gray-200 dark:border-gray-700" />

        <router-link
          class="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
          :to="'/u/' + currentUser.id"
          @click="closeDropdown"
        >
          Mi perfil
        </router-link>
        <router-link
          class="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
          to="/settings"
          @click="closeDropdown"
        >
          Ajustes
        </router-link>
        <div class="border-t border-gray-200 dark:border-gray-700" />
        <button
          type="button"
          class="block w-full px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
          @click="logout()"
        >
          Cerrar sesión
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">

import { useAuth } from "@/composables/useAuth";
import { useAuthStore } from "@/store/authStore";
import { onBeforeUnmount, onMounted, ref } from "vue";
const auth = useAuth();
const authStore = useAuthStore();

const currentUser = authStore.loggedUser;
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const closeDropdown = () => {
  isOpen.value = false;
};

const onClickOutside = (event: MouseEvent) => {
  const target = event.target as Node;
  if (dropdownRef.value && !dropdownRef.value.contains(target)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener("click", onClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onClickOutside);
});

const logout = async () => {
  closeDropdown();
  await auth.logout();
};
</script>

