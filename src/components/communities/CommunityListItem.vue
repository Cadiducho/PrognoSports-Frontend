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
                    Comunidad {{ community.open ? "abierta" : "cerrada" }} con {{ community.cantidad_usuarios }} participantes
                </span><br />
                Número de apuestas en la quali: {{ community.qualify_positions_predict }} <br/>
                Número de apuestas en carera: {{ community.race_positions_predict }} <br/>
                <br>
                <i>Comunidad creada el <time :datetime="community.created">{{ community.created | humanDate }}</time></i>
                <br />
                <div class="buttons mt-2">
                    <b-button v-if="community.open && !isUserInCommunity" type="is-success" @click="tryJoinCommunity">Unirse</b-button>
                    <b-button v-if="isUserInCommunity" type="is-danger" @click="tryLeaveCommunity">Dejar comunidad</b-button>
                    <b-button tag="router-link" type="is-link is-light" :to="'/communities/' + community.name">Detalles</b-button>
                </div>
            </div>
        </div>

        <b-modal
            v-model="isJoinModalActive"
            has-modal-card
            :can-cancel="true">
            <ConfirmJoinCommunityModal />
        </b-modal>
        <b-modal
            v-model="isLeaveModalActive"
            has-modal-card
            :can-cancel="true">
            <ConfirmLeaveCommunityModal />
        </b-modal>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {Community} from "@/types/Community";
import {communityService} from "@/_services";
import ConfirmLeaveCommunityModal from "@/components/communities/ConfirmLeaveCommunityModal.vue";
import ConfirmJoinCommunityModal from "@/components/communities/ConfirmJoinCommunityModal.vue";

@Component<CommunityListItem>({
    components: {ConfirmJoinCommunityModal, ConfirmLeaveCommunityModal},
})
export default class CommunityListItem extends Vue {
    @Prop() community!: Community;
    private isUserInCommunity: boolean = false;
    private isJoinModalActive: boolean = false;
    private isLeaveModalActive: boolean = false;

    created() {
        this.validateUserInCommunity();
    }

    private validateUserInCommunity() {
        communityService.validateUserInCommunity(this.community).then(is => {
            this.isUserInCommunity = is;
        });
    }

    private tryJoinCommunity() {
        this.$buefy.modal.open({
            parent: this,
            component: ConfirmJoinCommunityModal,
            trapFocus: false,
            props: {community: this.community}
        });
    }

    private tryLeaveCommunity() {
        this.$buefy.modal.open({
            parent: this,
            component: ConfirmLeaveCommunityModal,
            trapFocus: false,
            props: {community: this.community}
        });
    }
}
</script>

<style scoped>

</style>