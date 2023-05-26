<template>
    <article class="w-full sm:w-1/2 md:w-1/2 xl:w-1/3 p-4">
        <router-link
            :to="gp.gpLink()"
            class="c-card block bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden text-gray-700 hover:scale-110 transition ease-in-out delay-150 duration-300">
           
            <div class="relative pb-48 overflow-hidden">
                <img class="absolute inset-0 h-full w-full object-contain" :src="gp.circuit?.logoImage()" alt="" />
            </div>

            <div class="p-4">
                <span class="inline-block px-2 py-1 leading-none bg-orange-200 text-orange-800 rounded-full font-semibold uppercase tracking-wide text-xs">
                    Ronda #{{ gp.round }}
                </span>
                <h2 class="mt-2 mb-2 font-bold">{{ gp.name }} de {{ gp.season.name }}</h2>
                <p class="text-sm">{{ gp.circuit.name }}, {{ gp.circuit.locality }} ({{ gp.circuit.country }})</p>
            </div>

            <div class="p-4 border-t border-b text-xs text-gray-700">
                <span v-for="(session, key) in gp.sessions" :key="key" class="flex justify-between items-center mb-1">
                    <b class="mr-1 flex">{{ session.humanName() }}:</b> {{ humanDateTime(session.date) }} ({{ dateDiff(session.date) }}) <br />
                </span>
            </div>
            <!-- Por si quieres header
                <div class="p-4 flex items-center text-sm text-gray-600">
                    <span class="ml-2">34 Bewertungen</span>
                </div>
            -->
        </router-link>
    </article>
</template>

<script lang="ts">
import { GrandPrix } from "@/types/GrandPrix";
import { Circuit } from "@/types/Circuit";

import { defineComponent, PropType } from "vue";
import { useAuthStore } from "@/store/authStore";
import { useCommunityStore } from "@/store/communityStore";
import { useDayjs } from "@/composables/useDayjs";

export default defineComponent({
    name: "GrandPrixItem",
    props: {
        gp: {
            type: Object as PropType<GrandPrix>,
            required: true,
        },
    },
    setup() {
        const dayjs = useDayjs();
        const { dateDiff, humanDateTime } = dayjs;

        const authStore = useAuthStore();
        const communityStore = useCommunityStore();

        const currentUser = authStore.loggedUser;
        const currentCommunity = communityStore.currentCommunity;
        return { currentUser, currentCommunity, dateDiff, humanDateTime };
    },
});
</script>
