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
import { Component, Prop, Vue } from "vue-property-decorator";
import {Community} from "@/types/Community";
import {communityService} from "@/_services";
import EventBus from "@/plugins/eventbus";
import {namespace} from "vuex-class";
const Auth = namespace("Auth");

@Component
export default class ConfirmLeaveCommunityModal extends Vue {
    @Prop() community!: Community;
    @Auth.State("community") private currentCommunity!: Community;
    @Auth.Action removeCommunity!: () => void;

    public leaveCommunity() {
        if (this.community.id == this.currentCommunity.id) {
            this.$oruga.notification.open({
                message: "No puedes dejar la comunidad en la que estás en este momento",
                variant: "warning",
            });
            this.$emit('close');
        } else {
            communityService.quitCommunity(this.community).then(() => {
                this.$oruga.notification.open({
                    message: "¡Has dejado la comunidad " + this.community.name + "!",
                    variant: "success",
                });
            }).catch((error) => {
                this.$oruga.notification.open({
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
}
</script>

<style scoped>

</style>