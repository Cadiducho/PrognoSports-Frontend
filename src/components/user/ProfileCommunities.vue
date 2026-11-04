<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@pinia/colada";
import type { User } from "@/types/User";
import { userCommunitiesQuery } from "@/queries/communities";
import PTitle from "@/components/lib/PTitle.vue";
import PTag from "@/components/lib/PTag.vue";

const props = defineProps<{
  user: User;
}>();

// La misma consulta que el selector de comunidades: la clave lleva el id, así que cambiar de perfil no mezcla listas
const { data } = useQuery(() => userCommunitiesQuery(props.user.id));
const communities = computed(() => data.value ?? []);
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
