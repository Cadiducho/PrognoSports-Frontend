<script setup lang="ts">
import { ref, watch } from "vue";
import type { User } from "@/types/User";
import type { Community } from "@/types/Community";
import { communityService } from "@/_services";
import PTitle from "@/components/lib/PTitle.vue";
import PTag from "@/components/lib/PTag.vue";

const props = defineProps<{
  user: User;
}>();

const communities = ref<Community[]>([]);

// Evita que una respuesta lenta de un perfil anterior pise al actual
let lastRequest = 0;

watch(() => props.user.id, async (id) => {
  const request = ++lastRequest;
  communities.value = [];
  if (!id) {
    return;
  }
  try {
    const list = await communityService.getUserCommunities(props.user);
    if (request === lastRequest) {
      communities.value = list;
    }
  } catch (error: unknown) {
    console.error(error);
  }
}, { immediate: true });
</script>

<template>
  <div>
    <section v-if="communities.length > 0">
      <PTitle
        tag="h3"
        type="subtitle"
      >
        Comunidades
      </PTitle>
      <ul class="flex flex-wrap gap-2">
        <li
          v-for="community in communities"
          :key="community.id"
        >
          <router-link
            :to="{ name: 'communitiesDetails', params: { community: community.name } }"
            class="inline-flex"
          >
            <PTag
              color="info"
              size="large"
            >
              {{ community.name }}
            </PTag>
          </router-link>
        </li>
      </ul>
    </section>
  </div>
</template>
