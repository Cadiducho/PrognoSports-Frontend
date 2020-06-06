<template>
    <div id="homeComponent" class="container-fluid">

        <b-breadcrumb :items="breadcumbItems"></b-breadcrumb>

        <PrognoPageTitle name="Dashboard" />

        <b-row>
            <b-col lg="4">
                <NextGrandPrix :competition="currentCommunity.competition" />
            </b-col>
            <b-col lg="8">
                <div class="card">
                    Espacio a rellenar muy rico
                    {{currentCommunity.competition}}
                </div>
            </b-col>
        </b-row>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import PrognoPageTitle from "@/components/lib/PrognoPageTitle.vue";
    import NextGrandPrix from "@/components/gps/NextGrandPrix.vue";
    import {AuthModule} from "@/_store/modules/AuthModule";
    import {Community} from "@/types/Community";
    import {CommunityModule} from "@/_store/modules/CommunityModule";
    import {User} from "@/types/User";
    import {UserModule} from "@/_store/modules/UserModule";

    @Component({
        components: {
            NextGrandPrix,
            PrognoPageTitle
        }
    })
    export default class Home extends Vue {

        private currentCommunity: Community = CommunityModule.currentCommunity;
        private profile: User = UserModule.profile;

        get loading() {
            return AuthModule.authStatus === 'loading' && !AuthModule.isAuthenticated;
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