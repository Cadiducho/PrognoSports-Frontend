<template>
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">¿Salir de la comunidad?</p>
        </header>
        <section class="modal-card-body">
            ¿Estás seguro de que deseas abandonar la comunidad <span class="has-text-weight-semibold">{{ community.name }}</span>?
        </section>
        <footer class="modal-card-foot">
            <o-button
                label="Dejar comunidad"
                variant="danger"
                @click="leaveCommunity()" />
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
import {communityService, notificationService} from "@/_services";
import {defineComponent, PropType} from "vue";
import {useCommunityStore} from "@/store/communityStore";
import useEmitter from "@/composables/useEmitter";

export default defineComponent({
    name: "ConfirmLeaveCommunityModal",
    props: {
        community: {
            type: Object as PropType<Community>,
            required: true
        }
    },
    setup() {
        const emitter = useEmitter();
        const communityStore = useCommunityStore();

        const currentCommunity = communityStore.community;
        const removeCommunity = communityStore.removeCommunity;
        return { removeCommunity, currentCommunity, emitter };
    },
    methods: {
        leaveCommunity() {
            if (this.community.id == this.currentCommunity.id) {
                notificationService.showNotification("No puedes dejar la comunidad en la que estás en este momento", "warning");
                this.$emit('close');
            } else {
                communityService.quitCommunity(this.community).then(() => {
                    notificationService.showNotification("¡Has dejado la comunidad " + this.community.name + "!");
                }).catch((error) => {
                    notificationService.showNotification("Ha ocurrido un error: " + error.message, "warning");
                }).finally(() => {
                    this.emitter.emit('reloadCommunitiesList');
                    this.emitter.emit('reloadCommunitiesDropdown');
                    this.$emit('close');
                });
            }
        }
    }
});
</script>