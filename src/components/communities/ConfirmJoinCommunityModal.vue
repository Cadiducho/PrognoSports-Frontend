<template>
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">¿Unirse a la comunidad?</p>
        </header>
        <section class="modal-card-body">
            ¿Deseas unirte a la comunidad <span class="has-text-weight-semibold">{{ community.name }}</span>?
        </section>
        <footer class="modal-card-foot">
            <b-button
                label="Unirse a la comunidad"
                type="is-success"
                @click="joinCommunity()" />
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
import {CommunityModule} from "@/_store/modules/CommunityModule";

@Component
export default class ConfirmJoinCommunityModal extends Vue {
    @Prop() community!: Community;

    public joinCommunity() {
        communityService.joinCommunity(this.community).then(communityRes => {
            this.$buefy.toast.open({
                message: "¡Te has unido correctamente a " + communityRes.name + "!",
                type: "is-success",
            });
            CommunityModule.setCurrentUserCommunity(communityRes);
            this.$router.push(`/communities/${communityRes.name}`);
        }).catch((error) => {
            this.$buefy.toast.open({
                message: "Ha ocurrido un error: " + error.message,
                type: "is-warning",
            });
        }).finally(() => {
            this.$emit('close');
        });
    }
}
</script>

<style scoped>

</style>