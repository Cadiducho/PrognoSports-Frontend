<template>
    <div id="homeComponent">
        <loading v-if="loading"/>
        test
        <div v-if="isAuthenticated">
            Hola, {{profile.username}}
            <br/>
            Estás en la comunidad {{currentCommunity}}
        </div>
        <br/><a @click="test">Cambiar de comunidad</a>

        <br/>
        <br/>
        <a @click="logout">Salir</a>
    </div>
</template>

<script>
    import { mapGetters, mapState } from 'vuex'
    import { AUTH_LOGOUT } from "@/_store/actions/auth";
    import { USER_CURRENT_COMMUNITY } from "@/_store/actions/community";

    export default {
        components: {
        },
        name: 'home',
        methods: {
            logout: function () {
                this.$store.dispatch(AUTH_LOGOUT).then(() => this.$router.push('/login'))
            },
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
            return {}
        },
    }
</script>