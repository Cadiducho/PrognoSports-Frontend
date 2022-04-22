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

                            <b-collapse :open="false" class="mb-2">
                                <template #trigger>
                                    <b-button
                                        label="Opciones de ordenado"
                                        type="is-primary" />
                                </template>

                                <div class="box">
                                    <b-field label="Orderar lista de miembros">
                                        <b-radio v-model='orderType' :native-value='0'>Por nombre de usuario</b-radio>
                                        <b-radio v-model='orderType' :native-value='1'>Por rango</b-radio>
                                        <b-radio v-model='orderType' :native-value='2'>Por conexión reciente</b-radio>
                                        <b-radio v-model='orderType' :native-value='3'>Por fecha de registro</b-radio>
                                    </b-field>
                                    <b-field>
                                        <b-switch v-model="orderAscendent">
                                            Orden {{ orderAscendent ? "ascendente" : "descendente" }}
                                        </b-switch>
                                    </b-field>
                                </div>
                            </b-collapse>

                            <b-field>
                                <b-input
                                    v-model="searchInput"
                                    placeholder="Buscar miembro"
                                    type="search"
                                    icon-pack="fas"
                                    icon="search"
                                />
                            </b-field>

                            <div class="mt-5 columns is-multiline is-4">
                                <div class="column is-half" v-for="cu in filteredMembers">
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
import dayjs from "dayjs";

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

    private searchInput: String = '';
    private orderType: number = 2;
    private orderAscendent: boolean = false;

    created() {
        let communityId = this.$route.params.community;

        communityService.getCommunityById(communityId).then((community) => {
            this.community = community;
            this.thereIsCommunity = true;

            this.isUserInCommunity = community.user_is_member;
            communityService.getMembers(community).then(list => {
                this.members.push(...list);
            }).catch(() => {}); // Ignorar si no tiene permisos, simplemente no se rellena
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

    get filteredMembers(): Array<CommunityUser> {
        const sortUsername = (m1: CommunityUser, m2: CommunityUser) => (m1.user.username < m2.user.username ? -1 : 1);
        const sortRank = (m1: CommunityUser, m2: CommunityUser) => (m1.user.rank.name < m2.user.rank.name ? -1 : 1);
        const sortRegisterDate = (m1: CommunityUser, m2: CommunityUser) => (dayjs(m1.user.created).isBefore(m2.user.created) ? -1 : 1);

        const sortLastConnect = (m1: CommunityUser, m2: CommunityUser) => {
            if (m1.user.last_activity === undefined) return 1;
            if (m2.user.last_activity === undefined) return -1;
            const d1 = new Date(m1.user.last_activity);
            const d2 = new Date(m2.user.last_activity);
            return (d1 < d2 ? 10 : -10);
        }

        let pickedSort: (m1: CommunityUser, m2: CommunityUser) => (number);
        switch (this.orderType) {
            case 1: pickedSort = sortRank; break;
            case 2: pickedSort = sortLastConnect; break;
            case 3: pickedSort = sortRegisterDate; break;
            default: pickedSort = sortUsername;
        }
        let listaOrdenada = this.members.sort(pickedSort);

        if (this.orderAscendent) {
            listaOrdenada = listaOrdenada.reverse();
        }

        if (!this.searchInput.trim()) {
            return listaOrdenada;
        }

        const filtroLowerCase: string = this.searchInput.toLowerCase().trim();

        return listaOrdenada.filter((member) => {
            return (
                member.user.username
                    .toLowerCase()
                    .includes(filtroLowerCase) ||
                (member.user.bio ?? "")
                    .toLowerCase()
                    .includes(filtroLowerCase) ||
                member.user.rank.name
                    .toLowerCase()
                    .includes(filtroLowerCase)
            );
        });
    }
}
</script>