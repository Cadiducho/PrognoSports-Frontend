<template>
    <div class="font-semibold driver-card justify-start p-3 rounded-md opacity-90 bg-contrast
        hover:bg-sky-50 dark:bg-contrast-dark dark:hover:bg-gray-700 shadow-sm"
         :style="styleDriverCard(driver)">
        <span class="dark:text-gray-100">
            <b v-if="showPosition">{{ index + 1 }}º.</b> {{ driver.firstname }} {{ driver.lastname }}
            <span class="tag is-rounded" v-bind:style="styleDorsal(driver)">#{{ driver.number }}</span>

            <span class="margin-left-card font-normal">
                <span v-if="currentUser.preferences['use-long-team-names']">{{ driver.team.longname }} ({{ driver.team.carname }})</span>
                <span v-else>{{ driver.team.name }}</span>
            </span>
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
}
.margin-left-card {
    margin-left: 0.5rem;
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
    .margin-left-card {
        display: block;
        margin-left: 0.0rem;
    }
}
</style>