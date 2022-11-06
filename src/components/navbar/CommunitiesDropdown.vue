<template>
    <div id="communtiesDropdown" class="navbar-item has-dropdown is-hoverable" v-if="currentCommunity.id !== 0">
        <a class="navbar-link">
            {{ currentCommunity.name }}
        </a>

        <div class="navbar-dropdown">
            <router-link class="navbar-item is-active" :to="{name: 'communitiesDetails', params: { community: currentCommunity.name}}">
                {{ currentCommunity.name }}
            </router-link>
            <hr class="navbar-divider" v-if="communitiesList.length > 0">
            <a class="navbar-item" v-for="com in communitiesList" v-bind:key="com.id" @click="switchToCommunity(com)">
                {{ com.name }}
            </a>
            <hr class="navbar-divider">
            <router-link class="navbar-item" to="/communities">
                Todas las comunidades
            </router-link>
        </div>
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
                communitiesList: [] as Array<Community>
            }
        },
        watch: {
            currentCommunity(newCommunity, oldcommunity) {
                this.getCommunityList();
            }
        },
        mounted() {
            this.emitter.on('reloadCommunitiesDropdown', () => {
                this.getCommunityList();
            });

            if (this.thereIsCurrentCommunity) {
                this.getCommunityList();
            }
        },
        methods: {
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
                this.setCommunity(targetCommunity);

                this.$router.push({
                    name: 'communitiesDetails',
                    params:  {
                        community: targetCommunity.name,
                    }
                }).then(() => {
                    notificationService.showNotification("Has cambiado a la comunidad " + targetCommunity.name, "info");
                    this.emitter.emit('reloadCommunitiesDropdown'); // Recargar la lista, que previsiblemente quitará la target y añadirá la que estaba originalmente
                })
            }
        }
    });
</script>