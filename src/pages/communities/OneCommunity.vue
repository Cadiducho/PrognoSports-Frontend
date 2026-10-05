<template>
  <div id="communityDetails">
    <PTitle
      class="mb-5"
      :name="communityName"
    />
    <loading v-if="isLoading" />

    <p v-if="!thereIsCommunity">
      La comunidad con nombre <i>{{ $route.params.community }}</i> no ha sido encontrada
    </p>
    <div
      v-else
      class="ui-grid"
    >
      <div class="ui-column ui-col-3">
        <PCard>
          <div class="ui-card-content">
            <figure class="ui-image">
              <img
                :src="community.communityImage()"
                alt="Community logo"
              >
            </figure>
          </div>
          <div class="ui-card-content">
            <div class="ui-media">
              <div class="ui-media-content">
                <PTitle>
                  {{ community.name }}
                </PTitle>
                <p class="dark:text-gray-300">
                  {{ community.description }}
                </p>
              </div>
            </div>

            <div class="ui-content">
              <p class="card-text">
                <b>Fecha de creación: </b>{{ humanDateTime(community.created) }}
              </p>
              <p class="card-text">
                <b>Creador: </b>
                <router-link :to="{name: 'user', params: { user: community.owner.id }}">
                  {{ community.owner.username }}
                </router-link>
              </p>
              <p
                v-if="community.open"
                class="card-text ui-text-success"
              >
                Comunidad abierta/pública
              </p>
              <p
                v-else
                class="card-text ui-text-danger"
              >
                Comunidad cerrada/privada
              </p>

              <PField
                v-if="!community.open && isUserInCommunity"
                grouped
                label="URL de Invitación:"
              >
                <input
                  class="ui-input rounded-full ui-small"
                  type="text"
                  :value="community.invitation"
                >
                <PButton
                  size="small"
                  pilled
                  @click="clickInvitation"
                >
                  Copiar
                </PButton>
              </PField>

              <p class="card-text">
                <b>Usuarios apuntados: </b> {{ community.members_amount }}
              </p>
            </div>
          </div>
        </PCard>
      </div>
      <div class="ui-column">
        <PCard>
          <div
            v-if="!community.open && !isUserInCommunity"
            class="ui-card-content"
          >
            <div class="ui-media">
              <div class="ui-media-content">
                <p class="ui-title ui-title-4">
                  Comunidad cerrada
                </p>
                <p class="ui-subtitle ui-subtitle-6">
                  Esta comunidad tiene la privacidad cerrada y
                  por lo tanto no puedes ver su lista de participantes si tú no eres miembro
                </p>
              </div>
            </div>
          </div>
          <div
            v-else-if="!members.length"
            class="ui-card-content"
          >
            <div class="ui-media">
              <div class="ui-media-content">
                <PTitle type="title">
                  Comunidad sin participantes
                </PTitle>
                <PTitle type="subtitle">
                  Esta comunidad no tiene participantes en este momento
                </PTitle>
              </div>
            </div>
          </div>
          <div
            v-else
            class="ui-card-content"
          >
            <section
              v-if="currentCommunity && currentCommunity.competition"
              class="ui-content"
            >
              <h2>Normas y puntuaciones</h2>
              <RulesAndPointsTable
                :competition="currentCommunity.competition"
                :community="currentCommunity"
              />
            </section>

            <p class="ui-title ui-title-4">
              Usuarios participando
            </p>

            <section class="busqueda-ordenada">
              <p-button
                color="teal"
                @click="opcionesOrdenadoOpen = !opcionesOrdenadoOpen"
              >
                Ordenar
              </p-button>

              <PInput
                v-model="searchInput"
                placeholder="Buscar miembro..."
                no-margin
              />
            </section>

            <PCollapse
              :open="opcionesOrdenadoOpen"
              class="box-ordenado"
            >
              <div class="ui-surface mt-1">
                <label class="ui-label">Orderar lista de usuarios</label>
                <div class="ui-field mb-0">
                  <PRadio
                    v-model="orderType"
                    :value="0"
                  >
                    Por nombre de usuario
                  </PRadio>
                </div>
                <div class="ui-field mb-0">
                  <PRadio
                    v-model="orderType"
                    :value="1"
                  >
                    Por rango
                  </PRadio>
                </div>
                <div class="ui-field mb-0">
                  <PRadio
                    v-model="orderType"
                    :value="2"
                  >
                    Por conexión reciente
                  </PRadio>
                </div>
                <div class="ui-field mb-1">
                  <PRadio
                    v-model="orderType"
                    :value="3"
                  >
                    Por fecha de registro
                  </PRadio>
                </div>
                <label class="ui-label mt-2">Dirección del orden</label>
                <div class="ui-field">
                  <PRadio
                    v-model="orderAscendent"
                    :value="true"
                  >
                    Orden ascendente
                  </PRadio>
                  <PRadio
                    v-model="orderAscendent"
                    :value="false"
                  >
                    Orden descendente
                  </PRadio>
                </div>
              </div>
            </PCollapse>

            <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-rows-1 sm:grid-rows-2 lg:grid-rows-3 xl:grid-rows-4 gap-2">
              <UserInCommunityCard
                v-for="member in filteredMembers"
                :key="member.user.id"
                :member="member"
              />
            </div>
          </div>
        </PCard>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import PTitle from "@/components/lib/PTitle.vue";
import {communityService, notificationService} from "@/_services";

import {Community} from "@/types/Community";
import {CommunityUser} from "@/types/CommunityUser";
import dayjs from "dayjs";

import {defineComponent} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import {useDayjs} from "@/composables/useDayjs";
import {useClipboard} from "@/composables/clipboard";
import Loading from "@/components/lib/Loading.vue";
import UserInCommunityCard from "@/components/communities/UserInCommunityCard.vue";
import RulesAndPointsTable from "@/components/communities/RulesAndPointsTable.vue";
import PRadio from "@/components/lib/forms/PRadio.vue";
import PCard from "@/components/lib/PCard.vue";
import PCollapse from "@/components/lib/PCollapse.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import PField from "@/components/lib/forms/PField.vue";

export default defineComponent({
    name: "OneCommunity",
    components: {
      PField,
      PInput, PButton,
      PCollapse,
      PCard,
        PRadio,
        RulesAndPointsTable,
        UserInCommunityCard,
        Loading,
        PTitle
    },
    setup() {
        const dayjs = useDayjs();
        const authStore = useAuthStore();
        const communityStore = useCommunityStore();
        const clipboard = useClipboard();

        const dateDiff = dayjs.dateDiff;
        const humanDateTime = dayjs.humanDateTime;
        const currentUser = authStore.loggedUser;
        const currentCommunity = communityStore.currentCommunity;
        return { currentUser, currentCommunity, dateDiff, humanDateTime, clipboard };
    },
    data() {
        return {
            community: {} as Community,
            isLoading: true,
            thereIsCommunity: false,
            members: new Array<CommunityUser>(),
            isUserInCommunity: false,

            searchInput: '',
            orderType: 2,
            orderAscendent: false,
            opcionesOrdenadoOpen: false
        }
    },
    computed: {
        communityName() {
            if (this.thereIsCommunity) {
                return this.community.name;
            } else {
                return "Comunidad no encontrada";
            }
        },
        filteredMembers(): Array<CommunityUser> {
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
            let listaOrdenada = [...this.members].sort(pickedSort);

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
    },
    created() {
        let communityId = this.$route.params.community;

        communityService.getCommunityById(communityId).then((community) => {
            this.community = community;
            this.thereIsCommunity = true;

            this.isUserInCommunity = community.user_is_member;
            communityService.getMembers(community).then(list => {
                this.members.push(...list);
            }).catch(() => {}); // Ignorar si no tiene permisos, simplemente no se rellena
        }).catch(() => {
            this.thereIsCommunity = false;
        }).finally(() => {
            this.isLoading = false;
        })
    },
    methods: {
        clickInvitation() {
            let invitation = "https://prognosports.com/invitation/" + this.community.name + "/" + this.community.invitation;
            this.clipboard.writeText(invitation).then(() => {
                notificationService.showNotification("Se te ha copiado la invitación al portapapeles");
            });
        },
    }
});
</script>
