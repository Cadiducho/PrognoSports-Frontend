<template>
    <div id="homeComponent" class="container-fluid">

        <b-breadcrumb :items="breadcumbItems"></b-breadcrumb>

        <PrognoPageTitle name="Dashboard" />

        <b-row>
            <b-col lg="4">
                <NextGrandPrix />
            </b-col>
            <b-col lg="8">
                <div class="card">
                    Espacio a rellenar muy rico
                </div>
            </b-col>
        </b-row>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
    import NextGrandPrix from "@/components/gps/NextGrandPrix.vue";
    import {namespace, State} from 'vuex-class'
    const auth = namespace('auth');
    import {Community} from "@/types/Community.ts";
    import {User} from "@/types/User";

    @Component({
        components: {
            NextGrandPrix,
            PrognoPageTitle
        }
    })
    export default class Home extends Vue {
        @auth.Getter isAuthenticated!: boolean;
        @auth.Getter authStatus!: string;
        @State(state => state.user.profile) profile!: User;
        @State(state => state.community.currentCommunity) currentCommunity!: Community;

        get loading() {
            return this.authStatus === 'loading' && !this.isAuthenticated;
        }

        private breadcumbItems = [
            {
                text: 'Inicio',
                to: '/home'
            },
            {
                text: 'Dashboard',
                active: true
            }
        ];
    }
</script>