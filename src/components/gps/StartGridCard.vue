<template>
  <div
    v-if="gridPos !== undefined"
    class="block"
  >
    <div
      class="card !text-center"
      :style="gridCardStyle(gridPos.driver)"
    >
      <header
        class="p-2"
        :style="gridCardBackgroundStyle(gridPos.driver)"
      >
        <div class="flex items-center justify-center gap-2">
          <PTag
            size="small"
            class="!bg-gray-800 !border-gray-800 dark:!bg-gray-800 dark:!border-gray-800 text-gray-light-50"
          >
            {{ gridPos.position }}º
          </PTag>
          <PTag
            color="success"
            size="small"
          >
            #{{ gridPos.driver.number }}
          </PTag>
          <PTooltip
            v-if="gridPos.note !== undefined"
            :label="gridPos.note"
          >
            <PTag
              color="warning"
              size="small"
            >
              !
            </PTag>
          </PTooltip>
        </div>
      </header>
      <div class="f1-card-main">
        <div class="f1-card-main-description">
          <PTooltip
            :label="fullname(gridPos.driver)"
            class="f1-card-driver"
          >
            {{ gridPos.driver.code }}
          </PTooltip>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import {StartGridPosition} from "@/types/StartGridPosition";
import {Driver} from "@/types/Driver";

import {defineComponent, PropType} from "vue";
import {useAuthStore} from "@/store/authStore";
import {useCommunityStore} from "@/store/communityStore";
import PTag from "@/components/lib/PTag.vue";
import PTooltip from "@/components/lib/PTooltip.vue";

export default defineComponent({
    name: "StartGridCard",
  components: {PTooltip, PTag},
    props: {
        gridPos: {
            type: Object as PropType<StartGridPosition>,
            required: true,
        }
    },
    setup() {
        const authStore = useAuthStore();
        const communityStore = useCommunityStore();

        const currentUser = authStore.loggedUser;
        const currentCommunity = communityStore.currentCommunity;
        return { currentUser, currentCommunity };
    },
    methods: {
        fullname(driver: Driver) {
            return driver.firstname + " " + driver.lastname;
        },
        gridCardStyle(driver: Driver) {
            return {
                'border': '1px solid #' + driver.team.teamcolor,
            }
        },
        gridCardBackgroundStyle(driver: Driver) {
            return {
                'background-color': '#'+ driver.team.teamcolor,
            }
        },
    }
});
</script>

<style scoped lang="scss">

.f1-card-main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
}

.f1-card-driver {
    display: block;
    font-size: 17px;
}

.f1-card-main-description {
    font-size: 12px;
    text-align: center;
}

.card.is-wide {
    width: 550px;
}

.card.has-text-centered {
    .card-header,
    .card-content,
    .card-footer {
        justify-content: center;
        align-items: center;
    }

    h1 {
        font-size: 1.75rem;
        font-weight: bold;
    }
}

.card-header {
    padding: 5px 0;
}

.card-content {
    padding: 3.5rem 0;
}

.card-footer {
    padding: 1rem 0;
    border: none;
    font-size: .9rem;
    color: lighten(black, 50%);
}

.tag {
    font-size: 0.60rem;
}
</style>
