<template>
  <div id="communityDetails">
    <PTitle
      class="mb-5"
      :name="communityName"
    />
    <loading v-if="isLoading" />

    <p
      v-if="!thereIsCommunity"
      class="text-gray-700 dark:text-gray-300"
    >
      La comunidad con nombre <i>{{ $route.params.community }}</i> no ha sido encontrada
    </p>
    <div
      v-else
      class="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,3fr)]"
    >
      <aside>
        <PCard padding="none">
          <figure class="aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              class="h-full w-full object-cover"
              :src="community.communityImage()"
              alt="Community logo"
            >
          </figure>
          <div class="space-y-3 p-4 sm:p-5">
            <PTitle
              type="subtitle"
              no-margin
            >
              {{ community.name }}
            </PTitle>
            <p class="text-gray-700 dark:text-gray-300">
              {{ community.description }}
            </p>

            <div class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <p><b>Fecha de creación: </b>{{ humanDateTime(community.created) }}</p>
              <p>
                <b>Creador: </b>
                <router-link
                  class="text-brand-600 hover:underline dark:text-brand-300"
                  :to="{name: 'user', params: { user: community.owner.id }}"
                >
                  {{ community.owner.username }}
                </router-link>
              </p>
              <p
                v-if="community.open"
                class="text-success-600 dark:text-success-400"
              >
                Comunidad abierta/pública
              </p>
              <p
                v-else
                class="text-error-600 dark:text-error-400"
              >
                Comunidad cerrada/privada
              </p>
              <p><b>Usuarios apuntados: </b>{{ community.members_amount }}</p>
            </div>

            <PField
              v-if="!community.open && isUserInCommunity"
              label="URL de Invitación:"
            >
              <div class="flex items-center gap-2">
                <PInput
                  class="flex-1"
                  size="small"
                  no-margin
                  readonly
                  :model-value="community.invitation"
                />
                <PButton
                  size="small"
                  pilled
                  @click="clickInvitation"
                >
                  Copiar
                </PButton>
              </div>
            </PField>
          </div>
        </PCard>
      </aside>

      <PCard class="min-w-0">
        <template v-if="!community.open && !isUserInCommunity">
          <PTitle
            type="header"
            tag="h2"
          >
            Comunidad cerrada
          </PTitle>
          <p class="text-gray-600 dark:text-gray-300">
            Esta comunidad tiene la privacidad cerrada y
            por lo tanto no puedes ver su lista de participantes si tú no eres miembro
          </p>
        </template>
        <template v-else-if="!members.length">
          <PTitle type="subtitle">
            Comunidad sin participantes
          </PTitle>
          <p class="text-gray-600 dark:text-gray-300">
            Esta comunidad no tiene participantes en este momento
          </p>
        </template>
        <template v-else>
          <section v-if="currentCommunity && currentCommunity.competition">
            <PTitle
              type="header"
              tag="h2"
            >
              Normas y puntuaciones
            </PTitle>
            <RulesAndPointsTable
              :competition="currentCommunity.competition"
              :community="currentCommunity"
            />
          </section>

          <PTitle
            class="mt-6"
            type="header"
            tag="h2"
          >
            Usuarios participando
          </PTitle>

          <PSearchSortBar
            v-model="searchInput"
            v-model:open="opcionesOrdenadoOpen"
            color="teal"
            placeholder="Buscar miembro..."
          >
            <template #options>
              <PLabel label="Ordenar lista de usuarios" />
              <PRadio
                v-model="orderType"
                :value="0"
              >
                Por nombre de usuario
              </PRadio>
              <PRadio
                v-model="orderType"
                :value="1"
              >
                Por rango
              </PRadio>
              <PRadio
                v-model="orderType"
                :value="2"
              >
                Por conexión reciente
              </PRadio>
              <PRadio
                v-model="orderType"
                :value="3"
              >
                Por fecha de registro
              </PRadio>

              <PLabel
                class="mt-3"
                label="Dirección del orden"
              />
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
            </template>
          </PSearchSortBar>

          <div class="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            <UserInCommunityCard
              v-for="member in filteredMembers"
              :key="member.user.id"
              :member="member"
            />
          </div>
        </template>
      </PCard>
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
import PSearchSortBar from "@/components/lib/PSearchSortBar.vue";
import PLabel from "@/components/lib/forms/PLabel.vue";
import PButton from "@/components/lib/forms/PButton.vue";
import PInput from "@/components/lib/forms/PInput.vue";
import PField from "@/components/lib/forms/PField.vue";

export default defineComponent({
    name: "OneCommunity",
    components: {
      PField,
      PInput, PButton,
      PSearchSortBar,
      PLabel,
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
