<template>
    <div id="logoutComponent">

    </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {namespace} from "vuex-class";
const Auth = namespace("Auth");
@Component
export default class Logout extends Vue {

    @Auth.Action private signOut!: () => Promise<void>;
    created() {
        this.signOut().then(() => {
            this.$router.push({name: 'login'});
            this.$buefy.toast.open({
                message: 'Has cerrado sesión correctamente',
                type: 'is-info'
            });
        });
    }
};
</script>