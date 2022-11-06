<template>
    <article class="column is-one-third">
        <router-link :to="gp.gpLink()">
            <div class="card">
                <div class="card-content">
                    <div class="media">
                        <div class="media-content">
                            <p class="title is-4">{{ gp.name }} de {{ gp.season.name }}</p>
                            <p class="subtitle">Ronda #{{ gp.round }}</p>
                            <p class="subtitle is-6">{{ gp.circuit.name }}, {{ gp.circuit.locality }} ({{ gp.circuit.country }})</p>
                        </div>
                        <div class="media-right">
                            <figure class="image is-128x128">
                                <img :src="gp.circuit.logoImage()" alt="Circuit logo">
                            </figure>
                        </div>
                    </div>
                    <p class="content block">
                        <span v-for="session in gp.sessions">
                            <b>{{ session.humanName() }}:</b> {{ humanDate(session.date) }} ({{ dateDiff(session.date) }}) <br />
                        </span>
                    </p>
                </div>
            </div>
        </router-link>
    </article>
</template>

<script lang="ts">
    import {GrandPrix} from "@/types/GrandPrix";
    import {Circuit} from "@/types/Circuit";

    import {defineComponent, PropType} from "vue";
    import {useAuthStore} from "@/store/authStore";
    import {useCommunityStore} from "@/store/communityStore";
    import {useDayjs} from "@/composables/useDayjs";

    export default defineComponent({
        name: "GrandPrixItem",
        props: {
            gp: {
                type: Object as PropType<GrandPrix>,
                required: true,
            }
        },
        setup() {
            const dayjs = useDayjs();
            const authStore = useAuthStore();
            const communityStore = useCommunityStore();

            const dateDiff = dayjs.dateDiff;
            const humanDate = dayjs.humanDate;
            const currentUser = authStore.loggedUser;
            const currentCommunity = communityStore.currentCommunity;
            return { currentUser, currentCommunity, dateDiff, humanDate };
        },
    });
</script>