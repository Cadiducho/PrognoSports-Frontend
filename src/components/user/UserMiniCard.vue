<template>
  <PCard
    tag="div"
    padding="sm"
    class="w-full max-w-sm"
  >
    <PMedia>
      <template #left>
        <figure class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <img
            :src="userProfileImageUrl(user)"
            alt="Profile image"
            class="h-full w-full object-cover"
          >
        </figure>
      </template>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="break-words text-xl font-semibold text-gray-900 dark:text-gray-100">{{ user.username }}</span>
        <span
          :style="{ color: `#${user.rank.color}`, 'border-color': `#${user.rank.color}` }"
          class="inline-flex whitespace-nowrap rounded border px-2 text-sm"
        >
          {{ user.rank.name }}
        </span>
      </div>
      <p
        v-if="user.bio"
        class="mt-1 break-words text-sm text-gray-600 dark:text-gray-300"
      >
        {{ user.bio }}
      </p>
    </PMedia>

    <hr class="my-2 border-gray-200 dark:border-gray-700">

    <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
      <li
        v-if="user.location"
        class="flex items-center gap-2"
      >
        <i class="fas fa-map-marker-alt fa-sm" />
        <span class="break-words">{{ user.location }}</span>
      </li>
      <li class="flex items-center gap-2">
        <i class="fas fa-clock fa-sm" />
        <span>Visto por última vez {{ dateDiff(user.last_activity) }}</span>
      </li>
    </ul>
  </PCard>
</template>

<script lang="ts">
import { User } from "@/types/User";
import {userProfileImageUrl} from "@/utils/user";
import {defineComponent, PropType} from "vue";
import {useDayjs} from "@/composables/useDayjs";
import PMedia from "@/components/lib/PMedia.vue";
import PCard from "@/components/lib/PCard.vue";

export default defineComponent({
  components: { PMedia, PCard },
    name: "ScoreComponents",
    props: {
        user: {
            type: Object as PropType<User>,
            required: true,
        }
    },
    setup() {
        const dayjs = useDayjs();
        const dateDiff = dayjs.dateDiff;
        return { dateDiff, userProfileImageUrl };
    }
});
</script>
