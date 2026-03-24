<template>
  <div
    id="communtiesDropdown"
    ref="dropdownRef"
    class="relative"
  >
    <template v-if="currentCommunity.id !== 0">
      <button
        type="button"
        class="inline-flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary md:w-auto dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
        :aria-expanded="isOpen"
        @click="isOpen = !isOpen"
      >
        <span class="truncate">{{ currentCommunity.name }}</span>
        <i class="fas fa-chevron-down text-xs" />
      </button>

      <div
        v-if="isOpen"
        class="left-0 z-30 mt-2 w-full min-w-60 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg md:absolute md:w-60 dark:border-gray-700 dark:bg-gray-900"
      >
        <router-link
          class="block bg-primary/10 px-4 py-2 text-sm font-medium text-primary dark:bg-primary/20"
          :to="{name: 'communitiesDetails', params: { community: currentCommunity.name}}"
          @click="closeDropdown"
        >
          {{ currentCommunity.name }}
        </router-link>
        <div
          v-if="communitiesList.length > 0"
          class="border-t border-gray-200 dark:border-gray-700"
        />
        <button
          v-for="com in communitiesList"
          :key="com.id"
          type="button"
          class="block w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
          @click="switchToCommunity(com)"
        >
          {{ com.name }}
        </button>
        <div class="border-t border-gray-200 dark:border-gray-700" />
        <router-link
          class="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
          to="/communities"
          @click="closeDropdown"
        >
          Todas las comunidades
        </router-link>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
    import {Community} from "@/types/Community";
    import {communityService, notificationService} from "@/_services";
    import {defineComponent} from "vue";
    import {useAuthStore} from "@/store/authStore";
    import {useCommunityStore} from "@/store/communityStore";
    import useEmitter from "@/composables/useEmitter";

    export default defineComponent({
        name: "CommunitiesDropdown",
        setup() {
            const emitter = useEmitter();

            const authStore = useAuthStore();
            const communityStore = useCommunityStore();

            const currentUser = authStore.loggedUser;
            const thereIsCurrentCommunity = communityStore.thereIsCurrentCommunity;
            const currentCommunity = communityStore.currentCommunity;
            const setCommunity = communityStore.setCommunity;

            return { currentUser, currentCommunity, thereIsCurrentCommunity, setCommunity, emitter };
        },
        data() {
            return {
                communitiesList: [] as Array<Community>,
                isOpen: false
            }
        },
        watch: {
            currentCommunity() {
                this.getCommunityList();
            }
        },
        mounted() {
            this.emitter.on('reloadCommunitiesDropdown', () => {
                this.getCommunityList();
            });

            document.addEventListener('click', this.handleClickOutside);

            if (this.thereIsCurrentCommunity) {
                this.getCommunityList();
            }
        },
        beforeUnmount() {
            document.removeEventListener('click', this.handleClickOutside);
        },
        methods: {
            closeDropdown() {
                this.isOpen = false;
            },
            handleClickOutside(event: MouseEvent) {
                if (this.$refs.dropdownRef && !(this.$refs.dropdownRef as HTMLElement).contains(event.target as Node)) {
                    this.closeDropdown();
                }
            },
            getCommunityList(): void {
                communityService.getUserCommunities(this.currentUser).then(list => {
                    this.communitiesList = [];
                    list.forEach(comm => {
                        // Agregar todas menos la activa, que ya saldrá en la primera
                        if (comm.name !== this.currentCommunity.name) {
                            this.communitiesList.push(comm);
                        }
                    })
                });
            },
            switchToCommunity(targetCommunity: Community) {
                this.closeDropdown();
                this.setCommunity(targetCommunity);

                this.$router.push({
                    name: 'communitiesDetails',
                    params:  {
                        community: targetCommunity.name,
                    }
                }).then(() => {
                    notificationService.showNotification("Has cambiado a la comunidad " + targetCommunity.name, "success");
                    this.emitter.emit('reloadCommunitiesDropdown'); // Recargar la lista, que previsiblemente quitará la target y añadirá la que estaba originalmente
                })
            }
        }
    });
</script>
