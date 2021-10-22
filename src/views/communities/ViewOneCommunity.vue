<template>
    <div id="communityDetails" class="box">
        <PrognoPageTitle class="mb-5" :name="communityName" />
        <loading v-if="isLoading" />

        <p v-if="!thereIsCommunity">La comunidad con nombre <i>{{ this.$route.params.community }}</i> no ha sido encontrada</p>
        <template v-else>
            <div class="columns">
                <div class='column is-3'>
                    <div class="card">
                        <div class="card-image">
                            <figure class="image">
                                <img :src="community.image_url" alt="Community logo">
                            </figure>
                        </div>
                        <div class="card-content">
                            <div class="media">
                                <div class="media-content">
                                    <p class="title is-4">{{community.name}}</p>
                                    <p class="subtitle is-6">{{community.description}}</p>
                                </div>
                            </div>

                            <div class="content">
                                <p class="card-text"><b>Fecha de creación: </b>{{community.created | humanDateTime}}</p>
                                <p class="card-text">
                                    <b>Creador: </b>
                                    <router-link :to="{name: 'user', params: { user: community.owner.username}}">
                                        {{community.owner.username}}
                                    </router-link>
                                </p>
                                <p v-if="community.open" class="card-text has-text-success">Comunidad abierta/pública</p>
                                <p v-else class="card-text has-text-danger">Comunidad cerrada/privada</p>
                                        <b-field
                                            v-if="!community.open && isUserInCommunity"
                                            grouped
                                            label="URL de Invitación:"
                                            type="is-rounded is-info">
                                            <b-input placeholder="URL"
                                                     :value="community.name + '/' + community.invitation ">
                                            </b-input>
                                            <p class="control">
                                                <b-button class="button is-info" @click="clickInvitation">Copiar</b-button>
                                            </p>
                                        </b-field>

                                <p class="card-text"><b>Usuarios apuntados: </b> {{ community.members_amount }}</p>
                                <p class="card-text"><b>Posiciones de clasificación pronosticadas</b>:
                                    {{ community.qualify_positions_predicted }}</p>
                                <p class="card-text"><b>Posiciones de carrera pronosticadas</b>:
                                    {{ community.race_positions_predicted }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="card">
                        <div v-if="community.open || isUserInCommunity" class="card-content">
                            <div class="media">
                                <div class="media-content">
                                    <p class="title is-4">Usuarios participando</p>
                                </div>
                            </div>

                            <div class="mt-5 columns is-multiline is-4">
                                <div class="column is-half" v-for="cu in members">
                                    <div class="box">
                                        <article class="media">
                                            <div class="media-left">
                                                <figure class="image is-64x64">
                                                    <img :src="cu.user.profileImageUrl || 'https://prognosports.com/logo_bw.png'" alt="User image">
                                                </figure>
                                            </div>
                                            <div class="media-content">
                                                <div class="content">
                                                    <p>
                                                        <strong>
                                                            <router-link :to="{name: 'user', params: { user: cu.user.username}}">
                                                                {{cu.user.username}}
                                                            </router-link>
                                                        </strong>
                                                        <small :style="{ color : '#' + cu.user.rank.color }">{{cu.user.rank.name}}</small>
                                                        <small>
                                                            <span class="icon-text" v-if="cu.user.last_activity">
                                                                <span class="icon">
                                                                    <i class="fas fa-clock"></i>
                                                                </span>
                                                                <span>
                                                                    <b-tooltip label="Última conexión">
                                                                        {{ cu.user.last_activity | dateDiff }}
                                                                    </b-tooltip>
                                                                </span>
                                                            </span>
                                                        </small>
                                                        <br>
                                                        {{cu.user.bio}}
                                                    </p>
                                                    <p>
                                                        <span class="icon-text">
                                                            <span class="icon">
                                                                <i class="fas fa-calendar"></i>
                                                            </span>
                                                            <span>Se unió el {{ cu.user.created | humanDateTime }}</span>
                                                        </span>
                                                    </p>
                                                </div>

                                                <span class="icon-text"  v-if="cu.can_kick_users">
                                                    <span class="icon">
                                                        <i class="fas fa-ban"></i>
                                                    </span>
                                                    <span>Puede expulsar usuarios</span>
                                                </span>

                                                <span class="icon-text" v-if="cu.can_modify_permissions">
                                                    <span class="icon">
                                                        <i class="fas fa-user-edit"></i>
                                                    </span>
                                                    <span >Puede modificar permisos</span>
                                                </span>

                                                <span class="icon-text" v-if="cu.can_recreate_invitation">
                                                    <span class="icon">
                                                        <i class="fas fa-envelope"></i>
                                                    </span>
                                                    <span>Puede recrear invitaciones</span>
                                                </span>
                                            </div>
                                        </article>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="card-content">
                            <div class="media">
                                <div class="media-content">
                                    <p class="title is-4">Comunidad cerrada</p>
                                    <p class="subtitle is-6">Esta comunidad tiene la privacidad cerrada y por lo tanto no puedes ver su lista de participantes si tú no eres miembro</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>


<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
import {communityService} from "@/_services";

import {Community} from "@/types/Community";
import {CommunityUser} from "@/types/CommunityUser";

@Component<ViewOneCommunity>({
    components: {
        PrognoPageTitle
    },
})
export default class ViewOneCommunity extends Vue {
    private community!: Community;
    private isLoading: boolean = true;
    private thereIsCommunity: boolean = false;
    private members: Array<CommunityUser> = [];
    private isUserInCommunity: boolean = false;

    created() {
        let communityId = this.$route.params.community;

        communityService.getCommunityById(communityId).then((community) => {
            this.community = community;
            this.thereIsCommunity = true;

            communityService.getMembers(community).then(list => {
                this.members.push(...list);
            });
            communityService.validateUserInCommunity(community).then(bool => this.isUserInCommunity = bool); //FixMe: Revisar este método, eficiencia
        }).catch((reason) => {
            this.thereIsCommunity = false;
        }).finally(() => {
            this.isLoading = false;
        })
    }

    get communityName() {
        if (this.thereIsCommunity) {
            return this.community.name;
        } else {
            return "Comunidad no encontrada";
        }
    }

    clickInvitation() {
        let invitation = "https://prognosports.com/invitation/" + this.community.name + "/" + this.community.invitation;
        this.$copyText(invitation).then(() => {
            this.$buefy.toast.open({
                message: "Se te ha copiado la invitación al portapapeles",
                type: "is-success",
            })}
        );
    }
}
</script>