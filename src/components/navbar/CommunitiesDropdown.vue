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
    import {communityService} from "@/_services";
    import {isValidCommunity} from "@/utils";
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

            const currentUser = authStore.user;
            const currentCommunity = communityStore.community;
            const setCommunity = communityStore.setCommunity;

            return { currentUser, currentCommunity, setCommunity, emitter };
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

            if (isValidCommunity(this.currentCommunity)) {
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
                    this.$oruga.notification.open({
                        position: 'top',
                        message:
                            "Has cambiado a la comunidad " + targetCommunity.name,
                        variant: "info",
                    });
                    this.emitter.emit('reloadCommunitiesDropdown'); // Recargar la lista, que previsiblemente quitará la target y añadirá la que estaba originalmente
                })
            }
        }
    });
</script>