<template>
    <div id="communitiesDropdown" v-if="currentCommunity !== undefined">
        <b-nav-item-dropdown :text="currentCommunity.name" right class="navbar-communities">
            <b-dropdown-item active :to="'/communities/' + currentCommunity.id">{{currentCommunity.name}}</b-dropdown-item>
            <b-dropdown-divider />
            <b-dropdown-item variant="info" to="/communities" >Todas las comunidades</b-dropdown-item>
        </b-nav-item-dropdown>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {Community} from "@/types/Community";
    import {State} from "vuex-class";

    @Component
    export default class CommunitiesDropdown extends Vue {
        @State(state => state.community.currentCommunity) currentCommunity!: Community;
    }
</script>