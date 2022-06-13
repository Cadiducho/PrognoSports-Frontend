<template>
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">¿Unirse a la comunidad?</p>
        </header>
        <section class="modal-card-body">
            ¿Deseas unirte a la comunidad <span class="has-text-weight-semibold">{{ community.name }}</span>?
        </section>
        <footer class="modal-card-foot">
            <o-button
                label="Unirse a la comunidad"
                variant="success"
                @click="joinCommunity()" />
            <o-button
                label="Cancelar"
                variant="light"
                @click="$parent.close()"
            />
        </footer>
    </div>
</template>

<script lang="ts">
import {Community} from "@/types/Community";
import {communityService} from "@/_services";
import EventBus from "@/plugins/eventbus";

import {defineComponent, PropType} from "vue";
import {useCommunityStore} from "@/pinia/communityStore";

export default defineComponent({
    name: "ConfirmJoinCommunityModal",
    props: {
        community: {
            type: Object as PropType<Community>,
            required: true
        }
    },
    setup() {
        const communityStore = useCommunityStore();

        const setCommunity = communityStore.setCommunity;
        return { setCommunity };
    },
    methods: {
        joinCommunity() {
            communityService.joinCommunity(this.community).then(communityRes => {
                this.$oruga.notification.open({
                    position: 'top',
                    message: "¡Te has unido correctamente a " + communityRes.name + "!",
                    variant: "success",
                });

                this.setCommunity(communityRes);
                this.$router.push(`/communities/${communityRes.name}`);
            }).catch((error) => {
                this.$oruga.notification.open({
                    position: 'top',
                    message: "Ha ocurrido un error: " + error.message,
                    variant: "warning",
                });
            }).finally(() => {
                EventBus.$emit('reloadCommunitiesList');
                EventBus.$emit('reloadCommunitiesDropdown');
                this.$emit('close');
            });
        }
    }
});
</script>
