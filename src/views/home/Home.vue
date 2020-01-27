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

<script>
    import { mapGetters, mapState } from 'vuex'

    import PrognoPageTitle from "@/components/lib/PrognoPageTitle";
    import NextGrandPrix from "@/components/gps/NextGrandPrix";
    import {USER_SET_CURRENT_COMMUNITY} from "@/_store/mutations.type";

    export default {
        components: {
            NextGrandPrix,
            PrognoPageTitle
        },
        name: 'home',
        methods: {
            test: function () {
                this.$store.commit(USER_SET_CURRENT_COMMUNITY, {id: 2, name: "Hola desde vue"})
            }
        },
        computed: {
            ...mapGetters(['isAuthenticated', 'authStatus']),
            ...mapState({
                profile: state => state.user.profile,
                currentCommunity: state => state.community.currentCommunity,
            }),
            loading: function () {
                return this.authStatus === 'loading' && !this.isAuthenticated;
            }
        },
        data () {
            return {
                breadcumbItems: [
                    {
                        text: 'Inicio',
                        to: '/home'
                    },
                    {
                        text: 'Dashboard',
                        active: true
                    }
                ]
            }
        },
    }
</script>