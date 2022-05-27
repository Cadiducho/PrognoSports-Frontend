<template>
    <div class="card mb-4">
        <div class="card-content">
            <div class="media">
                <div class="media-left">
                    <figure class="image is-48x48">
                        <router-link :to="'/communities/' + community.name">
                            <img :src="community.image_url" alt="Logo">
                        </router-link>
                    </figure>
                </div>
                <div class="media-content">
                    <p class="title is-4">
                        <router-link :to="'/communities/' + community.name" class="has-text-black">{{ community.name }}</router-link>
                        <i> - {{ community.competition.name }}</i>
                    </p>
                    <p class="subtitle is-6">{{ community.description }} (Creada por <router-link :to="'/u/' + community.owner.id">@{{community.owner.username}}</router-link>)</p>
                </div>
            </div>

            <div class="content">
                <span v-bind:class="[community.open ? 'has-text-success' : 'has-text-danger']">
                    Comunidad {{ community.open ? "abierta" : "cerrada" }} con {{ community.members_amount }} participantes
                </span><br />
                <br>
                <i>Comunidad creada el <time :datetime="community.created">{{ community.created | humanDateTime }}</time></i>
                <br />
                <div class="buttons mt-2">
                    <o-button v-if="community.open && !isUserInCommunity" variant="success" @click="tryJoinCommunity">Unirse</o-button>
                    <o-button v-if="isUserInCommunity" variant="danger" @click="tryLeaveCommunity">Dejar comunidad</o-button>
                    <o-button tag="router-link" variant="link is-light" :to="'/communities/' + community.name">Detalles</o-button>
                </div>
            </div>
        </div>

        <o-modal
            v-model="isJoinModalActive"
            has-modal-card
            :can-cancel="true">
            <ConfirmJoinCommunityModal />
        </o-modal>
        <o-modal
            v-model="isLeaveModalActive"
            has-modal-card
            :can-cancel="true">
            <ConfirmLeaveCommunityModal />
        </o-modal>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {Community} from "@/types/Community";
import ConfirmLeaveCommunityModal from "@/components/communities/ConfirmLeaveCommunityModal.vue";
import ConfirmJoinCommunityModal from "@/components/communities/ConfirmJoinCommunityModal.vue";

@Component<CommunityListItem>({
    components: {ConfirmJoinCommunityModal, ConfirmLeaveCommunityModal},
})
export default class CommunityListItem extends Vue {
    @Prop() community!: Community;
    @Prop() isUserInCommunity!: boolean;
    private isJoinModalActive: boolean = false;
    private isLeaveModalActive: boolean = false;

    private tryJoinCommunity() {
        this.$oruga.modal.open({
            parent: this,
            component: ConfirmJoinCommunityModal,
            trapFocus: false,
            props: {community: this.community}
        });
    }

    private tryLeaveCommunity() {
        this.$oruga.modal.open({
            parent: this,
            component: ConfirmLeaveCommunityModal,
            trapFocus: false,
            props: {community: this.community}
        });
    }
}
</script>