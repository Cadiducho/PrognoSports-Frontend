<template>
  <div
    class="flex cursor-move justify-start rounded-md bg-white p-3 font-semibold text-gray-800 opacity-90 shadow-sm hover:bg-sky-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
    :style="styleDriverCard(driver)"
  >
    <span class="max-lg:text-[0.8rem]">
      <b v-if="showPosition">{{ index + 1 }}º.</b> {{ driver.firstname }} {{ driver.lastname }}
      <PTag
        variant="rounded"
        size="small"
        :style="styleDorsal(driver)"
      >
        #{{ driver.number }}
      </PTag>

      <span class="ml-0 block font-normal lg:ml-2 lg:inline">
        <span v-if="currentUser.preferences['use-long-team-names']">{{ driver.team.longname }} ({{ driver.team.carname }})</span>
        <span v-else>{{ driver.team.name }}</span>
      </span>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { Driver } from "@/types/Driver";
import { useAuthStore } from "@/store/authStore";
import { useStyles } from "@/composables/useStyles";
import PTag from "@/components/lib/PTag.vue";

defineProps<{
  index: number;
  showPosition?: boolean;
  driver: Driver;
}>();

const authStore = useAuthStore();
const styles = useStyles();

const currentUser = authStore.loggedUser;
const styleDriverCard = styles.styleDriverCard;
const styleDorsal = styles.styleDorsal;
</script>
