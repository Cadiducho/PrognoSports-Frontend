<template>
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">¿Salir de la comunidad?</p>
        </header>
        <section class="modal-card-body">
            ¿Estás seguro de que deseas abandonar la comunidad <span class="has-text-weight-semibold">{{ community.name }}</span>?
        </section>
        <footer class="modal-card-foot">
            <b-button
                label="Dejar comunidad"
                type="is-danger"
                @click="leaveCommunity()" />
            <b-button
                label="Cancelar"
                type="is-light"
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
            this.$buefy.toast.open({
                message: "No puedes dejar la comunidad en la que estás en este momento",
                type: "is-warning",
            });
            this.$emit('close');
        } else {
            communityService.quitCommunity(this.community).then(() => {
                this.$buefy.toast.open({
                    message: "¡Has dejado la comunidad " + this.community.name + "!",
                    type: "is-success",
                });
            }).catch((error) => {
                this.$buefy.toast.open({
                    message: "Ha ocurrido un error: " + error.message,
                    type: "is-warning",
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