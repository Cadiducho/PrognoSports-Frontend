<template>
  <div class="ui-card user-mini-card">
    <div class="ui-card-content user-mini-card-content">
      <div class="ui-media user-mini-card-media">
        <div class="ui-media-left">
          <figure class="ui-image ui-image-64 zuga">
            <img
              :src="objUser.profileImage()"
              alt="Profile image"
              class="profile-image rounded-full"
            >
          </figure>
        </div>
        <div class="divisor" />
        <div class="ui-media-content">
          <div class="user-mini-card-header">
            <span class="ui-title ui-title-4 multiline-text">{{ objUser.username }}</span>

            <span class="content-rank">
              <span
                :style="{ color: `#${objUser.rank.color}`, 'border-color': `#${objUser.rank.color}` }"
                class="content-rank-name"
              >
                {{ objUser.rank.name }}
              </span>
            </span>
          </div>
          <p
            v-if="objUser.bio"
            class="ui-subtitle ui-subtitle-6 multiline-text"
          >
            {{ objUser.bio }}
          </p>
        </div>
      </div>
      <div class="divisor" />
      <div class="ui-content user-mini-card-details">
        <p
          v-if="objUser.location"
          class="content-icon content-location"
        >
          <span class="ui-icon ui-small">
            <i class="fas fa-map-marker-alt fa-sm mr-2" />
          </span>
          <span class="multiline-text">{{ objUser.location }}</span>
        </p>
        <p class="content-icon content-last_activity">
          <span class="ui-icon ui-small">
            <i class="fas fa-clock fa-sm mr-2" />
          </span>
          <span class="multiline-text">Visto por última vez {{ dateDiff(objUser.last_activity) }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { User } from "@/types/User";
import {computed, defineComponent, PropType} from "vue";
import {useDayjs} from "@/composables/useDayjs";

export default defineComponent({
    name: "ScoreComponents",
    props: {
        user: {
            type: Object as PropType<User>,
            required: true,
        }
    },
    setup(props) {
        const dayjs = useDayjs();
        const dateDiff = dayjs.dateDiff;
        const objUser = computed(() => new User(props.user));
        return { dateDiff, objUser };
    }
});
</script>

<style scoped>
.user-mini-card {
    @apply w-full max-w-sm overflow-hidden;
}

.user-mini-card-content {
    @apply p-3;
}

.user-mini-card-media {
    @apply flex-col gap-3 sm:flex-row sm:items-start;
}

.divisor {
    @apply my-2 h-px border-0 bg-gray-200 dark:bg-gray-700;
}

.user-mini-card-header {
    @apply flex flex-wrap justify-between gap-2;
}

.user-mini-card-details {
    @apply mt-2;
}

.content-icon {
    @apply mb-2 flex items-center text-sm;
}

.content-rank-name {
    @apply inline-flex justify-center rounded border border-transparent px-2 text-center text-sm whitespace-nowrap;
}

.profile-image {
    @apply max-h-full max-w-full object-contain;
}

.zuga {
    @apply flex items-center justify-center;
}

.multiline-text {
    white-space: normal;
}
</style>
