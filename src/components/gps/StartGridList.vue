<template>
  <PCard
    v-if="grid !== undefined"
  >
    <nav class="flex flex-wrap">
      <PTitle type="subtitle">
        Parrilla de Salida
      </PTitle>

      <PField
        v-if="Object.keys(chosenSession).length && availableSessions.length > 1"
        label="Sesión"
      >
        <PSelect
          v-model="chosenSession"
          placeholder="Selecciona la sesión"
          @change="changeGridSession()"
        >
          <option
            v-for="session in availableSessions"
            :key="session.id"
            :value="session"
          >
            {{ session.humanName() }}
          </option>
        </PSelect>
      </PField>
    </nav>
    <div class="columns is-mobile">
      <div class="column is-6">
        <div v-for="pos in parrillaIzquierda">
          <StartGridCard :grid-pos="pos" />
          <div class="block" />
        </div>
      </div>
      <div class="column is-6">
        <div
          v-for="pos in parrillaDerecha"
          class="parrillaDerecha"
        >
          <StartGridCard :grid-pos="pos" />
          <div class="block" />
        </div>
      </div>
    </div>
  </PCard>
</template>

<script lang="ts">
import {StartGridPosition} from "@/types/StartGridPosition";
import StartGridCard from "@/components/gps/StartGridCard.vue";
import {RaceSession} from "@/types/RaceSession";

import {defineComponent, PropType} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import useEmitter from "@/composables/useEmitter";
import dayjs from "dayjs";
import PTitle from "@/components/lib/PTitle.vue";
import PField from "@/components/lib/forms/PField.vue";
import PSelect from "@/components/lib/forms/PSelect.vue";
import PCard from "@/components/lib/PCard.vue";

export default defineComponent({
    name: "StartGridList",
    components: {PCard, PSelect, PField, PTitle, StartGridCard},
    props: {
        grid: {
            type: Map as PropType<Map<RaceSession, Array<StartGridPosition>>>,
            required: true,
        }
    },
    setup() {
        const emitter = useEmitter();
        const authStore = useAuthStore();
        const communityStore = useCommunityStore();

        const currentUser = authStore.loggedUser;
        const currentCommunity = communityStore.currentCommunity;
        return { currentUser, currentCommunity, emitter };
    },
    data() {
        return {
            chosenSession: {} as RaceSession,
            availableSessions: new Array<RaceSession>(),
        }
    },
    computed: {
        parrillaIzquierda(): StartGridPosition[] | undefined {
            return this.grid.get(this.chosenSession)?.filter((gridPos: StartGridPosition) => {
                return gridPos.position % 2 !== 0 && !gridPos.isFromPit;
            })
        },
        parrillaDerecha(): StartGridPosition[] | undefined  {
            return this.grid.get(this.chosenSession)?.filter((gridPos: StartGridPosition) => {
                return gridPos.position % 2 === 0  && !gridPos.isFromPit;
            })
        }
    },
    mounted() {
        this.chosenSession = this.grid.keys().next().value

        for (const ses of this.grid.keys()) {
            this.availableSessions.push(ses);
            if (dayjs(ses.date).isToday()) {
                this.chosenSession = ses;
            }
        }
    },
    methods: {
        changeGridSession() {
            this.emitter.emit('changeGridSession', this.chosenSession);
        },
    }
});
</script>

<style scoped>
.parrillaDerecha {
    margin-top: 1.5rem;
}
</style>
