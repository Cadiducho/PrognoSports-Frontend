<template>
    <div class="is-highlighted has-text-weight-semibold has-radius driver-card is-justify-content-left p-3 rounded-md opacity-90 bg-white"
         :style="styleDriverCard(driver)">
        <span>
            <b v-if="showPosition">{{ index + 1 }}º.</b> {{ driver.firstname }} {{ driver.lastname }}
            <span class="tag is-rounded" v-bind:style="styleDorsal(driver)">#{{ driver.number }}</span>

            <o-tooltip class="ml-1 driver-card-team"
                       :label="(currentUser.preferences['use-long-team-names'] ? driver.team.name : driver.team.longname) + ' (' + driver.team.carname + ')'">
                <span v-if="currentUser.preferences['use-long-team-names']">{{ driver.team.longname }}</span>
                <span v-else>{{ driver.team.name }}</span>
            </o-tooltip>
        </span>
    </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {Driver} from "@/types/Driver";
import {useAuthStore} from "@/store/authStore";
import {useStyles} from "@/composables/useStyles";

export default defineComponent({
    name: "DraggableDriverCard",
    props: {
        index: {
            type: Number,
            required: true,
        },
        showPosition: {
            type: Boolean,
            default: true
        },
        driver: {
            type: Object as PropType<Driver>,
            required: true
        }
    },
    setup() {
        const authStore = useAuthStore();
        const styles = useStyles();

        const currentUser = authStore.loggedUser;
        const styleDriverCard = styles.styleDriverCard;
        const styleDorsal = styles.styleDorsal;

        return { currentUser, styleDriverCard, styleDorsal };
    },
});
</script>

<style scoped lang="scss">
@use '@/scss/variables';

.driver-card {
    display: flex;
    cursor: move !important;

    .driver-card-team {
        font-weight: lighter;
    }
}

// Resolución móvil
@media screen and (max-width: variables.$desktop) {
    .driver-card {
        a, span {
            font-size: 0.8rem;
        }
        .tag {
            display: none;
        }
    }
}
</style>