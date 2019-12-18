<template>
    <div id="homeComponent" class="container-fluid">

        <b-breadcrumb :items="breadcumbItems"></b-breadcrumb>

        <progno-page-title name="Dashboard" />

        <b-row>
            <b-col lg="4">
                <next-grand-prix />
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
    import { USER_CURRENT_COMMUNITY } from "@/_store/actions/community";

    import PrognoPageTitle from "@/components/lib/PrognoPageTitle";
    import NextGrandPrix from "@/views/home/NextGrandPrix";

    export default {
        components: {
            NextGrandPrix,
            PrognoPageTitle
        },
        name: 'home',
        methods: {
            test: function () {
                this.$store.commit(USER_CURRENT_COMMUNITY, {id: 2, name: "Hola desde vue"})
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