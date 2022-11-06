<template>
    <div class="block" v-if="gridPos !== undefined">
        <div class="card has-text-centered" v-bind:style="gridCardStyle(gridPos.driver)">
            <header class="card-header" v-bind:style="gridCardBackgroundStyle(gridPos.driver)" >
                <div class="tags">
                    <span class="tag is-dark">{{ gridPos.position }}º</span>
                    <span class="tag is-success">#{{ gridPos.driver.number }}</span>
                    <o-tooltip v-if="gridPos.note !== undefined"
                               :label="gridPos.note" position="bottom">
                        <span class="tag is-warning">!</span>
                    </o-tooltip>
                </div>
            </header>
            <div class="f1-card-main">
                <div class="f1-card-main-description">
                    <o-tooltip :label="fullname(gridPos.driver)" variant="primary" class="f1-card-driver">
                        {{ gridPos.driver.code }}
                    </o-tooltip>
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

export default defineComponent({
    name: "StartGridCard",
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