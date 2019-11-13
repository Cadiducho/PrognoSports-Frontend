<template>
    <div>
        <loading v-if="loading"/>
        <div v-if="isAuthenticated">
            Hola, {{profile.username}}
        </div>

        <a @click="logout">Salir</a>
    </div>
</template>

<script>
    import { mapGetters, mapState } from 'vuex'
    import {AUTH_LOGOUT} from "../_store/actions/auth";

    export default {
        components: {
        },
        name: 'home',
        methods: {
            logout: function () {
                this.$store.dispatch(AUTH_LOGOUT).then(() => this.$router.push('/login'))
            }
        },
        computed: {
            ...mapGetters(['isAuthenticated', 'authStatus']),
            ...mapState({profile: state => state.user.profile}),
            loading: function () {
                return this.authStatus === 'loading' && !this.isAuthenticated;
            }
        },
        data () {
            return {}
        },
    }
</script>