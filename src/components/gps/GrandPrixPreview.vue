<template>
    <div>
        <article class="tile is-child box">
            <div class="media">
                <div class="media-content">
                    <p class="title is-4">{{gp.name}} de {{gp.season.name}}</p>
                    <p class="subtitle is-6">{{gp.circuit.name}}, {{gp.circuit.locality}} ({{gp.circuit.country}})</p>
                </div>
                <div class="media-right">
                    <figure class="image is-128x128">
                        <img :src="circuitLogoImage(gp.circuit)" alt="Circuit logo">
                    </figure>
                </div>
            </div>
            <p class="content block">
                <span v-for="session in gp.sessions">
                    {{ session.humanName() }}: {{ session.date | humanDate }} ({{ session.date | dateDiff }}) <br />
                </span>
            </p>
            <footer class="card-footer">
                <o-button tag="router-link"
                          :to="gpLink"
                          variant="info is-light" expanded>
                    Pronosticar
                </o-button>
            </footer>
        </article>
    </div>
</template>

<script lang="ts">
    import {GrandPrix} from "@/types/GrandPrix";
    import {Circuit} from "@/types/Circuit";

    import {defineComponent, PropType} from "vue";
    import {useAuthStore} from "@/pinia/authStore";
    import {useCommunityStore} from "@/pinia/communityStore";

    export default defineComponent({
        name: "GrandPrixPreview",
        props: {
            gp: {
                type: Object as PropType<GrandPrix>,
                required: true,
            }
        },
        setup() {
            const authStore = useAuthStore();
            const communityStore = useCommunityStore();

            const currentUser = authStore.user;
            const currentCommunity = communityStore.community;
            return { currentUser, currentCommunity };
        },
        methods: {
            circuitLogoImage(circuit: Circuit) {
                return circuit?.logo_url ?? import('@/assets/default_profile_image.jpg');
            }
        },
        computed: {
            gpLink(): Object {
                return {
                    name: "gpdetails",
                    params: {
                        competition: this.gp.competition.code,
                        season: this.gp.season.name,
                        id: this.gp.id,
                    }
                };
            }
        }
    });
</script>